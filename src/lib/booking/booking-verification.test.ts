/**
 * Automated Verification Suite for Glama Salon Booking & WhatsApp Reminders
 */
import { calculateAvailableSlots } from './availability';
import { validateAndCreateBooking, normalizePhoneNumber, generateReferenceCode } from './validation';
import { initialSalonSettings, initialServices, initialStylists } from '../mock-data';
import { Appointment, Customer, BookingStepData } from '@/types';

function runTestSuite() {
  console.log('=== RUNNING GLAMA BEAUTY STUDIO VERIFICATION SUITE ===\n');
  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string) {
    total++;
    if (condition) {
      console.log(`✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`✗ FAIL: ${testName}`);
    }
  }

  // 1. Phone number normalization (E.164)
  const norm1 = normalizePhoneNumber('555-019-2001');
  assert(norm1 === '+15550192001', 'Normalizes 10-digit US number to +1 E.164 format');

  const norm2 = normalizePhoneNumber('+44 7911 123456');
  assert(norm2 === '+447911123456', 'Preserves international country codes');

  // 2. Reference code generation
  const refCode = generateReferenceCode('2026-10-28');
  assert(
    refCode.startsWith('GLM-20261028-') && refCode.length === 17,
    'Generates standard GLM-YYYYMMDD-XXXX booking reference code'
  );

  // 3. Slot availability calculation
  const slots = calculateAvailableSlots({
    date: '2026-10-28', // Wednesday
    serviceId: initialServices[0].id, // 60 min haircut
    stylistId: initialStylists[0].id,
    settings: initialSalonSettings,
    services: initialServices,
    stylists: initialStylists,
    appointments: [],
  });

  assert(slots.length > 0, 'Generates valid booking slots during salon operating hours');

  // Verify lunch break exclusion (13:00 to 14:00)
  const lunchSlot = slots.find((s) => s.time === '13:00' || s.time === '13:30');
  assert(
    lunchSlot !== undefined && lunchSlot.available === false,
    'Blocks slots during staff lunch break (13:00 - 14:00)'
  );

  // 4. Collision prevention
  const mockExistingAppointment: Appointment = {
    id: 'apt-test-collision',
    reference_code: 'GLM-20261028-1111',
    customer_id: 'cust-1',
    service_id: initialServices[0].id,
    stylist_id: initialStylists[0].id,
    service_name_snapshot: 'Signature Haircut & Blowdry',
    service_price_snapshot: 85,
    service_duration_snapshot: 60,
    add_ons_snapshot: [],
    total_amount: 85,
    deposit_amount: 0,
    appointment_date: '2026-10-28',
    start_time: '11:00:00',
    end_time: '12:00:00',
    start_datetime: '2026-10-28T11:00:00Z',
    end_datetime: '2026-10-28T12:00:00Z',
    status: 'confirmed',
    payment_status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const bookingAttempt: BookingStepData = {
    serviceId: initialServices[0].id,
    selectedAddOns: [],
    stylistId: initialStylists[0].id,
    date: '2026-10-28',
    time: '11:00', // Collides with existing appointment
    customerName: 'Elena Rostova',
    customerPhone: '+1 555-999-0000',
    customerEmail: 'elena@example.com',
    customerNotes: '',
    whatsappConsent: true,
    paymentOption: 'salon',
  };

  const collisionResult = validateAndCreateBooking({
    data: bookingAttempt,
    service: initialServices[0],
    stylist: initialStylists[0],
    existingAppointments: [mockExistingAppointment],
    existingCustomers: [],
    settings: initialSalonSettings,
  });

  assert(
    collisionResult.isValid === false,
    'Strictly rejects overlapping appointment for the same specialist'
  );

  // 5. Valid booking & automated reminder job generation
  const validAttempt: BookingStepData = {
    serviceId: initialServices[0].id, // is_haircut: true
    selectedAddOns: [initialServices[0].add_ons[0].name],
    stylistId: initialStylists[0].id,
    date: '2026-10-28',
    time: '15:00', // Free time slot
    customerName: 'Victoria Beckham',
    customerPhone: '+1 555-321-4321',
    customerEmail: 'victoria@example.com',
    customerNotes: 'Event styling preparation',
    whatsappConsent: true,
    paymentOption: 'deposit_online',
  };

  const validResult = validateAndCreateBooking({
    data: validAttempt,
    service: initialServices[0],
    stylist: initialStylists[0],
    existingAppointments: [mockExistingAppointment],
    existingCustomers: [],
    settings: initialSalonSettings,
  });

  assert(validResult.isValid === true, 'Successfully validates non-conflicting booking');
  assert(
    validResult.appointment?.total_amount ===
      initialServices[0].price + initialServices[0].add_ons[0].price,
    'Accurately calculates total amount including selected service add-ons'
  );
  assert(
    validResult.reminderJob !== undefined &&
      validResult.reminderJob.template_name === 'glama_booking_confirmation',
    'Schedules instant WhatsApp booking confirmation job when consent is granted'
  );

  console.log(`\nVerification Complete: ${passed}/${total} checks passed.`);
}

runTestSuite();
