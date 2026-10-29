import { NextRequest, NextResponse } from 'next/server';
import { getInitialData, saveDataState } from '@/lib/data-store';
import { normalizePhoneNumber } from '@/lib/booking/validation';

// Meta Webhook Verification (GET)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'glama_webhook_secret_2026';

  if (mode === 'subscribe' && token === verifyToken) {
    return new Response(challenge || '', { status: 200 });
  }

  return new Response('Forbidden', { status: 403 });
}

// Meta Webhook Event Processor (POST)
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    // Process entry items
    const entries = payload.entry || [];
    const data = getInitialData();
    let customersUpdated = false;
    let updatedCustomers = [...data.customers];

    for (const entry of entries) {
      const changes = entry.changes || [];
      for (const change of changes) {
        const value = change.value;
        if (!value) continue;

        // 1. Process incoming messages (e.g. STOP / Opt-Out requests)
        const messages = value.messages || [];
        for (const msg of messages) {
          const fromPhone = normalizePhoneNumber(msg.from || '');
          const textBody = (msg.text?.body || '').trim().toUpperCase();

          if (['STOP', 'UNSUBSCRIBE', 'CANCEL', 'OPT OUT', 'OPTOUT'].includes(textBody)) {
            // Find and flag customer as opted out
            updatedCustomers = updatedCustomers.map((c) => {
              if (c.normalized_phone === fromPhone) {
                customersUpdated = true;
                return {
                  ...c,
                  whatsapp_opt_out: true,
                  updated_at: new Date().toISOString(),
                };
              }
              return c;
            });
          }
        }
      }
    }

    if (customersUpdated) {
      saveDataState({ customers: updatedCustomers });
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error processing WhatsApp webhook:', error);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
