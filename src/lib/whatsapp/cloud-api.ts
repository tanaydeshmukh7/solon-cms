import { WHATSAPP_TEMPLATES } from './templates';

export interface SendWhatsAppMessageParams {
  toPhone: string;
  templateName: string;
  parameters: Record<string, string | number>;
}

export interface SendWhatsAppResponse {
  success: boolean;
  messageId?: string;
  isSimulated: boolean;
  status: 'sent' | 'simulated' | 'failed';
  error?: string;
  rawPayload?: Record<string, unknown>;
  rawResponse?: Record<string, unknown>;
}

export async function sendWhatsAppTemplateMessage({
  toPhone,
  templateName,
  parameters,
}: SendWhatsAppMessageParams): Promise<SendWhatsAppResponse> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  // Clean phone number: remove non-digits
  const cleanPhone = toPhone.replace(/[^0-9]/g, '');

  const templateConfig = WHATSAPP_TEMPLATES[templateName];
  if (!templateConfig) {
    return {
      success: false,
      isSimulated: false,
      status: 'failed',
      error: `Unknown template: ${templateName}`,
    };
  }

  // Build template parameters in order
  const parameterComponents = templateConfig.parameters.map((paramKey) => ({
    type: 'text',
    text: String(parameters[paramKey] ?? ''),
  }));

  const payload = {
    messaging_product: 'whatsapp',
    to: cleanPhone,
    type: 'template',
    template: {
      name: templateName,
      language: {
        code: 'en_US',
      },
      components: [
        {
          type: 'body',
          parameters: parameterComponents,
        },
      ],
    },
  };

  // If live credentials are not configured, run safely in Test/Simulator Mode
  if (!token || !phoneNumberId) {
    const mockMessageId = `sim_wamid_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    return {
      success: true,
      messageId: mockMessageId,
      isSimulated: true,
      status: 'simulated',
      rawPayload: payload,
      rawResponse: {
        messaging_product: 'whatsapp',
        contacts: [{ input: cleanPhone, wa_id: cleanPhone }],
        messages: [{ id: mockMessageId, message_status: 'accepted' }],
        note: 'WhatsApp credentials not yet provided in .env.local. Test simulation recorded successfully.',
      },
    };
  }

  try {
    const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        isSimulated: false,
        status: 'failed',
        error: data.error?.message || `WhatsApp Cloud API error: HTTP ${res.status}`,
        rawPayload: payload,
        rawResponse: data,
      };
    }

    const messageId = data.messages?.[0]?.id;
    return {
      success: true,
      messageId,
      isSimulated: false,
      status: 'sent',
      rawPayload: payload,
      rawResponse: data,
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Network error during WhatsApp request';
    return {
      success: false,
      isSimulated: false,
      status: 'failed',
      error: errorMessage,
      rawPayload: payload,
    };
  }
}
