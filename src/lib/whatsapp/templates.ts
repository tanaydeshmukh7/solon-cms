export interface WhatsAppTemplate {
  name: string;
  category: 'UTILITY' | 'MARKETING';
  description: string;
  body: string;
  parameters: string[];
}

export const WHATSAPP_TEMPLATES: Record<string, WhatsAppTemplate> = {
  glama_haircut_30d_reminder: {
    name: 'glama_haircut_30d_reminder',
    category: 'MARKETING',
    description: 'Automated 30-day haircut return reminder',
    body: "Hey {{customer_name}}! ✨ It's been about a month since your last haircut at {{salon_name}}. Ready for a fresh look? Book your next appointment here: {{booking_url}}",
    parameters: ['customer_name', 'salon_name', 'booking_url'],
  },
  glama_booking_confirmation: {
    name: 'glama_booking_confirmation',
    category: 'UTILITY',
    description: 'Immediate appointment confirmation with reference code',
    body: 'Hi {{customer_name}}, your appointment at {{salon_name}} for {{service_name}} with {{stylist_name}} is confirmed for {{appointment_date}} at {{appointment_time}}. Reference: {{reference_code}}. We look forward to seeing you!',
    parameters: [
      'customer_name',
      'salon_name',
      'service_name',
      'stylist_name',
      'appointment_date',
      'appointment_time',
      'reference_code',
    ],
  },
  glama_appointment_reminder_24h: {
    name: 'glama_appointment_reminder_24h',
    category: 'UTILITY',
    description: 'Reminder sent 24 hours prior to appointment',
    body: 'Friendly reminder: You have an upcoming appointment at {{salon_name}} tomorrow at {{appointment_time}} with {{stylist_name}}. Need to reschedule? Reply or call us at {{phone}}.',
    parameters: ['customer_name', 'salon_name', 'appointment_time', 'stylist_name', 'phone'],
  },
  glama_cancellation_notification: {
    name: 'glama_cancellation_notification',
    category: 'UTILITY',
    description: 'Booking cancellation notice',
    body: 'Hi {{customer_name}}, your appointment (Ref: {{reference_code}}) at {{salon_name}} has been cancelled as requested. You can rebook anytime at {{booking_url}}.',
    parameters: ['customer_name', 'reference_code', 'salon_name', 'booking_url'],
  },
  glama_post_appointment_review: {
    name: 'glama_post_appointment_review',
    category: 'UTILITY',
    description: 'Post-service review and care instructions',
    body: 'Thank you for visiting {{salon_name}} today, {{customer_name}}! We hope you love your new look. Please take a moment to leave us a quick review: {{review_url}}',
    parameters: ['salon_name', 'customer_name', 'review_url'],
  },
};
