import {
  BookingTimeSlot,
  SalonSettings,
  Service,
  Stylist,
  Appointment,
} from '@/types';
import { initialStylists, initialServices } from '../mock-data';

interface AvailabilityParams {
  date: string; // YYYY-MM-DD
  serviceId: string;
  stylistId?: string; // 'any' or specific stylist ID
  settings: SalonSettings;
  services: Service[];
  stylists: Stylist[];
  appointments: Appointment[];
}

export function calculateAvailableSlots({
  date,
  serviceId,
  stylistId = 'any',
  settings,
  services,
  stylists,
  appointments,
}: AvailabilityParams): BookingTimeSlot[] {
  const service = services.find((s) => s.id === serviceId) || initialServices[0];
  if (!service) return [];

  // Parse target date and day of week
  const [year, month, day] = date.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  const dayIndex = targetDate.getDay(); // 0 is Sunday, 1 is Monday, ...

  const dayNames: (keyof typeof settings.opening_hours)[] = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  const daySchedule = settings.opening_hours[dayNames[dayIndex]];

  if (!daySchedule || daySchedule.closed) {
    return [];
  }

  // Determine eligible stylists
  let eligibleStylists = stylists.filter((st) => st.is_active);
  if (stylistId && stylistId !== 'any') {
    eligibleStylists = eligibleStylists.filter((st) => st.id === stylistId);
  } else {
    // Stylists who provide this service
    eligibleStylists = eligibleStylists.filter(
      (st) => !st.services || st.services.length === 0 || st.services.includes(service.id)
    );
  }

  if (eligibleStylists.length === 0) {
    // Fallback to all active stylists if none specifically assigned
    eligibleStylists = stylists.filter((st) => st.is_active);
  }

  const [openHour, openMinute] = daySchedule.open.split(':').map(Number);
  const [closeHour, closeMinute] = daySchedule.close.split(':').map(Number);

  const openTimeMinutes = openHour * 60 + openMinute;
  const closeTimeMinutes = closeHour * 60 + closeMinute;

  const totalDuration = service.duration_minutes + (service.buffer_after_minutes || 0);
  const interval = settings.booking_slot_interval_minutes || 30;

  // Existing active appointments on this date
  const dayAppointments = appointments.filter(
    (apt) => apt.appointment_date === date && !['cancelled', 'no_show'].includes(apt.status)
  );

  const slots: BookingTimeSlot[] = [];

  for (
    let slotStart = openTimeMinutes;
    slotStart + service.duration_minutes <= closeTimeMinutes;
    slotStart += interval
  ) {
    const slotEnd = slotStart + totalDuration;
    const hour = Math.floor(slotStart / 60);
    const minute = slotStart % 60;
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

    // Standard lunch break: 13:00 to 14:00 (780 to 840 mins)
    const lunchStart = 13 * 60;
    const lunchEnd = 14 * 60;
    const overlapsLunch = slotStart < lunchEnd && slotEnd > lunchStart;

    // Check if at least one eligible stylist is free for this time block
    let availableStylist: Stylist | null = null;

    if (!overlapsLunch) {
      for (const stylist of eligibleStylists) {
        const hasConflict = dayAppointments.some((apt) => {
          if (apt.stylist_id && apt.stylist_id !== stylist.id) {
            return false;
          }
          const [aptStartHour, aptStartMinute] = apt.start_time.split(':').map(Number);
          const [aptEndHour, aptEndMinute] = apt.end_time.split(':').map(Number);
          const aptStart = aptStartHour * 60 + aptStartMinute;
          const aptEnd = aptEndHour * 60 + aptEndMinute;

          return slotStart < aptEnd && slotEnd > aptStart;
        });

        if (!hasConflict) {
          availableStylist = stylist;
          break;
        }
      }
    }

    slots.push({
      time: timeString,
      available: availableStylist !== null,
      stylistId: availableStylist?.id,
      reason: overlapsLunch
        ? 'Lunch break'
        : availableStylist
        ? undefined
        : 'All stylists booked',
    });
  }

  return slots;
}
