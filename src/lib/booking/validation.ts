import {
  BookingStepData,
  Appointment,
  Customer,
  Service,
  Stylist,
  SalonSettings,
  ReminderJob,
} from '@/types';

export function generateReferenceCode(dateStr: string): string {
  const cleanDate = dateStr.replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `GLM-${cleanDate}-${randomSuffix}`;
}

export function normalizePhoneNumber(phone: string): string {
  // Strip non-numeric characters except leading plus
  let cleaned = phone.replace(/[^0-9+]/g, '');
  if (!cleaned.startsWith('+')) {
    // Default to +1 if 10 digits
    if (cleaned.length === 10) {
      cleaned = `+1${cleaned}`;
    } else {
      cleaned = `+${cleaned}`;
    }
  }
  return cleaned;
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
  appointment?: Appointment;
  customer?: Customer;
  reminderJob?: ReminderJob;
}

export function validateAndCreateBooking({
  data,
  service,
  stylist,
  existingAppointments,
  existingCustomers,
  settings,
}: {
  data: BookingStepData;
  service: Service;
  stylist?: Stylist;
  existingAppointments: Appointment[];
  existingCustomers: Customer[];
  settings: SalonSettings;
}): ValidationResult {
  // 1. Basic validation
  if (!data.customerName || data.customerName.trim().length < 2) {
    return { isValid: false, error: 'Please provide a valid full name.' };
  }

  if (!data.customerPhone || data.customerPhone.trim().length < 7) {
    return { isValid: false, error: 'Please provide a valid phone number for booking updates.' };
  }

  if (!data.date || !data.time) {
    return { isValid: false, error: 'Please select an appointment date and time.' };
  }

  // 2. Calculate time bounds
  const [startH, startM] = data.time.split(':').map(Number);
  const startTotalMins = startH * 60 + startM;
  const endTotalMins = startTotalMins + service.duration_minutes;

  const endH = Math.floor(endTotalMins / 60);
  const endM = endTotalMins % 60;
  const endTimeStr = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}:00`;
  const startTimeStr = `${startH.toString().padStart(2, '0')}:${startM.toString().padStart(2, '0')}:00`;

  const startDatetime = `${data.date}T${startTimeStr}Z`;
  const endDatetime = `${data.date}T${endTimeStr}Z`;

  // 3. Collision check
  if (stylist) {
    const hasConflict = existingAppointments.some((apt) => {
      if (apt.appointment_date !== data.date) return false;
      if (['cancelled', 'no_show'].includes(apt.status)) return false;
      if (apt.stylist_id && apt.stylist_id !== stylist.id) return false;

      const [aptSH, aptSM] = apt.start_time.split(':').map(Number);
      const [aptEH, aptEM] = apt.end_time.split(':').map(Number);
      const aptS = aptSH * 60 + aptSM;
      const aptE = aptEH * 60 + aptEM;

      return startTotalMins < aptE && endTotalMins > aptS;
    });

    if (hasConflict) {
      return {
        isValid: false,
        error: `Stylist ${stylist.name} is no longer available at ${data.time}. Please choose another time.`,
      };
    }
  }

  // 4. Calculate prices
  const selectedAddOns = (service.add_ons || []).filter((ao) =>
    data.selectedAddOns.includes(ao.name)
  );
  const addOnsTotal = selectedAddOns.reduce((sum, ao) => sum + ao.price, 0);
  const totalAmount = service.price + addOnsTotal;
  const depositAmount =
    data.paymentOption === 'deposit_online'
      ? Math.round(totalAmount * (settings.deposit_percentage / 100))
      : 0;

  // 5. Customer Record
  const normalizedPhone = normalizePhoneNumber(data.customerPhone);
  let customer = existingCustomers.find((c) => c.normalized_phone === normalizedPhone);

  const customerId = customer ? customer.id : `cust-${Date.now()}`;
  if (!customer) {
    customer = {
      id: customerId,
      full_name: data.customerName.trim(),
      phone: data.customerPhone.trim(),
      normalized_phone: normalizedPhone,
      email: data.customerEmail?.trim() || undefined,
      total_visits: 1,
      total_spent: totalAmount,
      whatsapp_consent: data.whatsappConsent,
      whatsapp_opt_out: false,
      consent_recorded_at: new Date().toISOString(),
      consent_source: 'booking_engine',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  } else {
    customer = {
      ...customer,
      total_visits: customer.total_visits + 1,
      total_spent: customer.total_spent + totalAmount,
      whatsapp_consent: data.whatsappConsent ? true : customer.whatsapp_consent,
      updated_at: new Date().toISOString(),
    };
  }

  // 6. Appointment Record
  const appointmentId = `apt-${Date.now()}`;
  const referenceCode = generateReferenceCode(data.date);

  const appointment: Appointment = {
    id: appointmentId,
    reference_code: referenceCode,
    customer_id: customerId,
    service_id: service.id,
    stylist_id: stylist?.id,
    service_name_snapshot: service.name,
    service_price_snapshot: service.price,
    service_duration_snapshot: service.duration_minutes,
    add_ons_snapshot: selectedAddOns,
    total_amount: totalAmount,
    deposit_amount: depositAmount,
    appointment_date: data.date,
    start_time: startTimeStr,
    end_time: endTimeStr,
    start_datetime: startDatetime,
    end_datetime: endDatetime,
    status: 'confirmed',
    payment_status: depositAmount > 0 ? 'deposit_paid' : 'pending',
    customer_notes: data.customerNotes || undefined,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    customer,
    stylist,
    service,
  };

  // 7. Schedule Booking Confirmation WhatsApp Reminder (if consented)
  let reminderJob: ReminderJob | undefined;
  if (data.whatsappConsent && settings.auto_reminders_enabled) {
    reminderJob = {
      id: `rem-${Date.now()}`,
      idempotency_key: `confirm_${appointmentId}`,
      appointment_id: appointmentId,
      customer_id: customerId,
      job_type: 'booking_confirmation',
      scheduled_for: new Date().toISOString(),
      status: 'pending',
      attempts: 0,
      max_attempts: 3,
      template_name: 'glama_booking_confirmation',
      template_parameters: {
        customer_name: customer.full_name,
        service_name: service.name,
        appointment_date: data.date,
        appointment_time: data.time,
        stylist_name: stylist ? stylist.name : 'Any Available Stylist',
        reference_code: referenceCode,
        salon_name: settings.salon_name,
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  return {
    isValid: true,
    appointment,
    customer,
    reminderJob,
  };
}
