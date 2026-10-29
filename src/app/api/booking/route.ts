import { NextRequest, NextResponse } from 'next/server';
import { getInitialData, saveDataState } from '@/lib/data-store';
import { validateAndCreateBooking } from '@/lib/booking/validation';
import { BookingStepData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: BookingStepData = await request.json();
    const data = getInitialData();

    const service = data.services.find((s) => s.id === body.serviceId);
    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Selected service not found.' },
        { status: 400 }
      );
    }

    const stylist =
      body.stylistId && body.stylistId !== 'any'
        ? data.stylists.find((st) => st.id === body.stylistId)
        : undefined;

    const validation = validateAndCreateBooking({
      data: body,
      service,
      stylist,
      existingAppointments: data.appointments,
      existingCustomers: data.customers,
      settings: data.settings,
    });

    if (!validation.isValid || !validation.appointment) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 409 }
      );
    }

    // Persist new appointment & customer
    const updatedAppointments = [validation.appointment, ...data.appointments];
    const updatedCustomers = validation.customer
      ? [
          validation.customer,
          ...data.customers.filter((c) => c.id !== validation.customer!.id),
        ]
      : data.customers;

    const updatedReminderJobs = validation.reminderJob
      ? [validation.reminderJob, ...data.reminderJobs]
      : data.reminderJobs;

    saveDataState({
      appointments: updatedAppointments,
      customers: updatedCustomers,
      reminderJobs: updatedReminderJobs,
    });

    return NextResponse.json({
      success: true,
      referenceCode: validation.appointment.reference_code,
      appointmentId: validation.appointment.id,
      appointment: validation.appointment,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal booking error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
