import { NextRequest, NextResponse } from 'next/server';
import { getInitialData } from '@/lib/data-store';
import { calculateAvailableSlots } from '@/lib/booking/availability';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const serviceId = searchParams.get('serviceId');
    const stylistId = searchParams.get('stylistId') || 'any';

    if (!date || !serviceId) {
      return NextResponse.json(
        { error: 'Missing date or serviceId query parameters.' },
        { status: 400 }
      );
    }

    const data = getInitialData();
    const slots = calculateAvailableSlots({
      date,
      serviceId,
      stylistId,
      settings: data.settings,
      services: data.services,
      stylists: data.stylists,
      appointments: data.appointments,
    });

    return NextResponse.json({
      success: true,
      date,
      slots,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error calculating slots';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
