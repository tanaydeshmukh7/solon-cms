import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsAppTemplateMessage } from '@/lib/whatsapp/cloud-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { toPhone, templateName, parameters } = body;

    if (!toPhone || !templateName) {
      return NextResponse.json(
        { success: false, error: 'Missing toPhone or templateName.' },
        { status: 400 }
      );
    }

    const result = await sendWhatsAppTemplateMessage({
      toPhone,
      templateName,
      parameters: parameters || {},
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal WhatsApp send error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
