export type UserRole = 'owner' | 'admin' | 'manager' | 'stylist' | 'receptionist';

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'rescheduled';

export type PaymentStatus =
  | 'pending'
  | 'deposit_paid'
  | 'fully_paid'
  | 'partially_refunded'
  | 'refunded';

export type PaymentMethod = 'cash' | 'upi' | 'card' | 'online' | 'bank_transfer';

export type ReminderType =
  | 'booking_confirmation'
  | 'appointment_reminder_24h'
  | 'appointment_reminder_2h'
  | 'haircut_30d_followup'
  | 'service_followup'
  | 'reschedule_notification'
  | 'cancellation_notification';

export type ReminderStatus =
  | 'pending'
  | 'processing'
  | 'sent'
  | 'delivered'
  | 'read'
  | 'failed'
  | 'cancelled'
  | 'skipped';

export interface DaySchedule {
  open: string;
  close: string;
  closed: boolean;
}

export interface SalonOpeningHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface SalonSettings {
  id: string;
  salon_name: string;
  tagline: string;
  phone: string;
  whatsapp_number: string;
  email: string;
  address: string;
  google_maps_url?: string;
  currency: string;
  currency_symbol: string;
  tax_percentage: number;
  deposit_percentage: number;
  booking_slot_interval_minutes: number;
  haircut_reminder_days: number;
  auto_reminders_enabled: boolean;
  whatsapp_cloud_api_phone_id?: string;
  whatsapp_cloud_api_waba_id?: string;
  instagram_url?: string;
  facebook_url?: string;
  pinterest_url?: string;
  tiktok_url?: string;
  youtube_url?: string;
  opening_hours: SalonOpeningHours;
  cancellation_policy: string;
  updated_at: string;
  created_at: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  subtitle?: string;
  cover_image: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceAddOn {
  name: string;
  price: number;
  duration_minutes: number;
}

export interface Service {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  cover_image: string;
  price: number;
  duration_minutes: number;
  buffer_after_minutes: number;
  is_featured: boolean;
  is_active: boolean;
  is_haircut: boolean;
  display_order: number;
  add_ons: ServiceAddOn[];
  created_at: string;
  updated_at: string;
  category?: ServiceCategory;
}

export interface Stylist {
  id: string;
  profile_id?: string;
  name: string;
  title: string;
  bio: string;
  photo_url: string;
  experience_years: number;
  rating: number;
  review_count: number;
  display_order: number;
  is_active: boolean;
  services?: string[]; // IDs of services
  created_at: string;
  updated_at: string;
}

export interface StylistWorkingHours {
  id: string;
  stylist_id: string;
  day_of_week: number; // 0-6
  start_time: string;
  end_time: string;
  lunch_break_start?: string;
  lunch_break_end?: string;
  is_day_off: boolean;
}

export interface Customer {
  id: string;
  full_name: string;
  phone: string;
  normalized_phone: string;
  email?: string;
  avatar_url?: string;
  notes?: string;
  total_visits: number;
  total_spent: number;
  last_visit_at?: string;
  whatsapp_consent: boolean;
  whatsapp_opt_out: boolean;
  consent_recorded_at?: string;
  consent_source: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  reference_code: string;
  customer_id: string;
  service_id: string;
  stylist_id?: string;
  service_name_snapshot: string;
  service_price_snapshot: number;
  service_duration_snapshot: number;
  add_ons_snapshot: ServiceAddOn[];
  total_amount: number;
  deposit_amount: number;
  appointment_date: string; // YYYY-MM-DD
  start_time: string; // HH:mm:ss
  end_time: string; // HH:mm:ss
  start_datetime: string; // ISO
  end_datetime: string; // ISO
  status: AppointmentStatus;
  payment_status: PaymentStatus;
  customer_notes?: string;
  internal_notes?: string;
  cancellation_reason?: string;
  cancelled_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  customer?: Customer;
  stylist?: Stylist;
  service?: Service;
}

export interface Payment {
  id: string;
  receipt_number: string;
  appointment_id?: string;
  customer_id?: string;
  amount: number;
  tax_amount: number;
  payment_method: PaymentMethod;
  transaction_reference?: string;
  gateway_name: string;
  gateway_payment_id?: string;
  is_deposit: boolean;
  status: string;
  notes?: string;
  created_at: string;
}

export interface Expense {
  id: string;
  title: string;
  category: string;
  amount: number;
  expense_date: string;
  payment_method: PaymentMethod;
  receipt_url?: string;
  notes?: string;
  created_by?: string;
  created_at: string;
}

export interface InventoryProduct {
  id: string;
  name: string;
  sku?: string;
  category: string;
  brand?: string;
  quantity: number;
  low_stock_threshold: number;
  unit_cost: number;
  retail_price?: number;
  supplier_name?: string;
  supplier_contact?: string;
  created_at: string;
  updated_at: string;
}

export interface Transformation {
  id: string;
  title: string;
  category: string; // 'Hair' | 'Makeup' | 'Nails' | 'Skin Care' | 'Bridal'
  service_id?: string;
  before_image_url?: string;
  after_image_url: string;
  stylist_id?: string;
  description?: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_role: string;
  avatar_url?: string;
  quote: string;
  rating: number;
  service_name?: string;
  is_featured: boolean;
  display_order: number;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  cover_image?: string;
  author_name: string;
  tags: string[];
  published_at: string;
  is_published: boolean;
  created_at: string;
}

export interface ReminderJob {
  id: string;
  idempotency_key: string;
  appointment_id?: string;
  customer_id: string;
  job_type: ReminderType;
  scheduled_for: string;
  status: ReminderStatus;
  attempts: number;
  max_attempts: number;
  last_attempt_at?: string;
  last_error?: string;
  provider_message_id?: string;
  template_name: string;
  template_parameters: Record<string, string | number>;
  created_at: string;
  updated_at: string;
  customer?: Customer;
  appointment?: Appointment;
}

export interface WhatsAppMessageLog {
  id: string;
  reminder_job_id?: string;
  customer_id?: string;
  phone: string;
  template_name?: string;
  direction: 'outbound' | 'inbound';
  status: string;
  provider_message_id?: string;
  raw_payload?: Record<string, unknown>;
  raw_response?: Record<string, unknown>;
  created_at: string;
}
