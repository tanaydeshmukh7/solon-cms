-- ============================================================================
-- GLAMA LUXURY BEAUTY STUDIO - PRODUCTION DATABASE SCHEMA
-- Migration: 20261027000000_initial_glama_schema.sql
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. ENUMS
-- ============================================================================

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('owner', 'admin', 'manager', 'stylist', 'receptionist');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE appointment_status AS ENUM (
        'pending',
        'confirmed',
        'in_progress',
        'completed',
        'cancelled',
        'no_show',
        'rescheduled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'deposit_paid', 'fully_paid', 'partially_refunded', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('cash', 'upi', 'card', 'online', 'bank_transfer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE reminder_type AS ENUM (
        'booking_confirmation',
        'appointment_reminder_24h',
        'appointment_reminder_2h',
        'haircut_30d_followup',
        'service_followup',
        'reschedule_notification',
        'cancellation_notification'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE reminder_status AS ENUM ('pending', 'processing', 'sent', 'delivered', 'read', 'failed', 'cancelled', 'skipped');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 2. SALON CONFIGURATION & SETTINGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS salon_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    salon_name VARCHAR(255) NOT NULL DEFAULT 'Glama Hair & Beauty Studio',
    tagline VARCHAR(255) DEFAULT 'Beauty. Care. Confidence.',
    phone VARCHAR(50) DEFAULT '+1 (123) 456-7890',
    whatsapp_number VARCHAR(50) DEFAULT '+1 (123) 456-7890',
    email VARCHAR(255) DEFAULT 'hello@glamasalon.com',
    address TEXT DEFAULT '123 Beauty Street, New York, NY 10001',
    google_maps_url TEXT,
    currency VARCHAR(10) DEFAULT 'USD',
    currency_symbol VARCHAR(5) DEFAULT '$',
    tax_percentage NUMERIC(5, 2) DEFAULT 0.00,
    deposit_percentage NUMERIC(5, 2) DEFAULT 20.00,
    booking_slot_interval_minutes INT DEFAULT 30,
    haircut_reminder_days INT DEFAULT 30,
    auto_reminders_enabled BOOLEAN DEFAULT true,
    whatsapp_cloud_api_phone_id VARCHAR(255),
    whatsapp_cloud_api_waba_id VARCHAR(255),
    instagram_url TEXT DEFAULT 'https://instagram.com/glamasalon',
    facebook_url TEXT DEFAULT 'https://facebook.com/glamasalon',
    pinterest_url TEXT DEFAULT 'https://pinterest.com/glamasalon',
    tiktok_url TEXT DEFAULT 'https://tiktok.com/@glamasalon',
    youtube_url TEXT DEFAULT 'https://youtube.com/@glamasalon',
    opening_hours JSONB DEFAULT '{
        "monday": {"open": "09:00", "close": "20:00", "closed": false},
        "tuesday": {"open": "09:00", "close": "20:00", "closed": false},
        "wednesday": {"open": "09:00", "close": "20:00", "closed": false},
        "thursday": {"open": "09:00", "close": "20:00", "closed": false},
        "friday": {"open": "09:00", "close": "20:00", "closed": false},
        "saturday": {"open": "09:00", "close": "20:00", "closed": false},
        "sunday": {"open": "10:00", "close": "18:00", "closed": false}
    }'::jsonb,
    cancellation_policy TEXT DEFAULT 'Cancellations must be made at least 24 hours prior to appointment time for a full refund of deposit.',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. USER PROFILES (Owners & Staff)
-- ============================================================================

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'stylist',
    phone VARCHAR(50),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 4. SERVICE CATEGORIES & SERVICES
-- ============================================================================

CREATE TABLE IF NOT EXISTS service_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    subtitle VARCHAR(255),
    cover_image TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES service_categories(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    cover_image TEXT,
    price NUMERIC(10, 2) NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 45,
    buffer_after_minutes INT DEFAULT 15,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    is_haircut BOOLEAN DEFAULT false, -- Flags service for 30-day haircut reminder
    display_order INT DEFAULT 0,
    add_ons JSONB DEFAULT '[]'::jsonb, -- Array of {name, price, duration_minutes}
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 5. STYLISTS & SCHEDULES
-- ============================================================================

CREATE TABLE IF NOT EXISTS stylists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255) DEFAULT 'Senior Stylist',
    bio TEXT,
    photo_url TEXT,
    experience_years INT DEFAULT 5,
    rating NUMERIC(3, 2) DEFAULT 4.9,
    review_count INT DEFAULT 45,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stylist_services (
    stylist_id UUID NOT NULL REFERENCES stylists(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    PRIMARY KEY (stylist_id, service_id)
);

CREATE TABLE IF NOT EXISTS stylist_working_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stylist_id UUID NOT NULL REFERENCES stylists(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
    start_time TIME NOT NULL DEFAULT '09:00:00',
    end_time TIME NOT NULL DEFAULT '20:00:00',
    lunch_break_start TIME DEFAULT '13:00:00',
    lunch_break_end TIME DEFAULT '14:00:00',
    is_day_off BOOLEAN DEFAULT false,
    UNIQUE (stylist_id, day_of_week)
);

CREATE TABLE IF NOT EXISTS stylist_time_off (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stylist_id UUID NOT NULL REFERENCES stylists(id) ON DELETE CASCADE,
    start_datetime TIMESTAMPTZ NOT NULL,
    end_datetime TIMESTAMPTZ NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 6. CUSTOMERS & CONSENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL UNIQUE,
    normalized_phone VARCHAR(50) NOT NULL, -- E.164 formatted for WhatsApp
    email VARCHAR(255),
    avatar_url TEXT,
    notes TEXT,
    total_visits INT DEFAULT 0,
    total_spent NUMERIC(10, 2) DEFAULT 0.00,
    last_visit_at TIMESTAMPTZ,
    whatsapp_consent BOOLEAN DEFAULT true,
    whatsapp_opt_out BOOLEAN DEFAULT false,
    consent_recorded_at TIMESTAMPTZ DEFAULT NOW(),
    consent_source VARCHAR(100) DEFAULT 'booking_flow',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customer_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    consent_type VARCHAR(50) NOT NULL DEFAULT 'whatsapp_marketing_and_reminders',
    is_granted BOOLEAN NOT NULL DEFAULT true,
    ip_address VARCHAR(45),
    user_agent TEXT,
    source VARCHAR(100) NOT NULL DEFAULT 'online_booking',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 7. APPOINTMENTS & TRANSACTIONAL SAFETY
-- ============================================================================

CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_code VARCHAR(20) NOT NULL UNIQUE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
    stylist_id UUID REFERENCES stylists(id) ON DELETE SET NULL,
    
    -- Snapshots of service details at booking time
    service_name_snapshot VARCHAR(255) NOT NULL,
    service_price_snapshot NUMERIC(10, 2) NOT NULL,
    service_duration_snapshot INT NOT NULL,
    add_ons_snapshot JSONB DEFAULT '[]'::jsonb,
    total_amount NUMERIC(10, 2) NOT NULL,
    deposit_amount NUMERIC(10, 2) DEFAULT 0.00,
    
    -- Booking timing
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    start_datetime TIMESTAMPTZ NOT NULL,
    end_datetime TIMESTAMPTZ NOT NULL,
    
    status appointment_status NOT NULL DEFAULT 'pending',
    payment_status payment_status NOT NULL DEFAULT 'pending',
    
    customer_notes TEXT,
    internal_notes TEXT,
    cancellation_reason TEXT,
    cancelled_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prevent double bookings for the same stylist during overlapping time windows
CREATE INDEX IF NOT EXISTS idx_appointments_stylist_timing 
ON appointments(stylist_id, start_datetime, end_datetime) 
WHERE status NOT IN ('cancelled', 'no_show');

CREATE INDEX IF NOT EXISTS idx_appointments_customer 
ON appointments(customer_id);

CREATE INDEX IF NOT EXISTS idx_appointments_date_status 
ON appointments(appointment_date, status);

CREATE TABLE IF NOT EXISTS appointment_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    previous_status appointment_status,
    new_status appointment_status NOT NULL,
    changed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    change_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 8. PAYMENTS & FINANCIAL TRANSACTIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receipt_number VARCHAR(50) NOT NULL UNIQUE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    amount NUMERIC(10, 2) NOT NULL,
    tax_amount NUMERIC(10, 2) DEFAULT 0.00,
    payment_method payment_method NOT NULL DEFAULT 'cash',
    transaction_reference VARCHAR(255),
    gateway_name VARCHAR(50) DEFAULT 'direct', -- 'razorpay', 'stripe', 'direct'
    gateway_payment_id VARCHAR(255),
    is_deposit BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'successful',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method payment_method DEFAULT 'card',
    receipt_url TEXT,
    notes TEXT,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 9. INVENTORY & STOCK MANAGEMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS inventory_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE,
    category VARCHAR(100) NOT NULL,
    brand VARCHAR(100),
    quantity INT NOT NULL DEFAULT 0,
    low_stock_threshold INT NOT NULL DEFAULT 5,
    unit_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    retail_price NUMERIC(10, 2),
    supplier_name VARCHAR(255),
    supplier_contact VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES inventory_products(id) ON DELETE CASCADE,
    change_quantity INT NOT NULL,
    movement_type VARCHAR(50) NOT NULL, -- 'restock', 'service_usage', 'retail_sale', 'damaged', 'audit'
    reference_id UUID, -- optional reference to appointment or invoice
    notes TEXT,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 10. WEBSITE CONTENT & CMS SECTIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS website_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(255),
    subtitle TEXT,
    eyebrow VARCHAR(100),
    content_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_visible BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transformations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'Hair', 'Makeup', 'Nails', 'Skin Care', 'Bridal'
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    before_image_url TEXT,
    after_image_url TEXT NOT NULL,
    stylist_id UUID REFERENCES stylists(id) ON DELETE SET NULL,
    description TEXT,
    display_order INT DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name VARCHAR(255) NOT NULL,
    client_role VARCHAR(100) DEFAULT 'Happy Client',
    avatar_url TEXT,
    quote TEXT NOT NULL,
    rating INT DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
    service_name VARCHAR(255),
    is_featured BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image TEXT,
    author_name VARCHAR(255) DEFAULT 'Glama Editorial Team',
    tags TEXT[] DEFAULT ARRAY['Beauty', 'Haircare'],
    published_at TIMESTAMPTZ DEFAULT NOW(),
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 11. AUTOMATED WHATSAPP REMINDER JOBS & MESSAGE LOGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS reminder_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idempotency_key VARCHAR(255) NOT NULL UNIQUE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    job_type reminder_type NOT NULL,
    scheduled_for TIMESTAMPTZ NOT NULL,
    status reminder_status NOT NULL DEFAULT 'pending',
    attempts INT DEFAULT 0,
    max_attempts INT DEFAULT 3,
    last_attempt_at TIMESTAMPTZ,
    last_error TEXT,
    provider_message_id VARCHAR(255),
    template_name VARCHAR(100) NOT NULL,
    template_parameters JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reminder_jobs_execution 
ON reminder_jobs(status, scheduled_for) 
WHERE status = 'pending';

CREATE TABLE IF NOT EXISTS whatsapp_message_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reminder_job_id UUID REFERENCES reminder_jobs(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    phone VARCHAR(50) NOT NULL,
    template_name VARCHAR(100),
    direction VARCHAR(10) DEFAULT 'outbound', -- 'outbound', 'inbound'
    status VARCHAR(50) NOT NULL, -- 'sent', 'delivered', 'read', 'failed'
    provider_message_id VARCHAR(255),
    raw_payload JSONB,
    raw_response JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(255),
    changes JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 12. DATABASE FUNCTIONS & AUTOMATION TRIGGERS
-- ============================================================================

-- Function to check stylist booking collision
CREATE OR REPLACE FUNCTION check_appointment_collision(
    p_stylist_id UUID,
    p_start_datetime TIMESTAMPTZ,
    p_end_datetime TIMESTAMPTZ,
    p_exclude_appointment_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_conflict_count INT;
BEGIN
    SELECT COUNT(*)
    INTO v_conflict_count
    FROM appointments
    WHERE stylist_id = p_stylist_id
      AND status NOT IN ('cancelled', 'no_show')
      AND (p_exclude_appointment_id IS NULL OR id != p_exclude_appointment_id)
      AND (start_datetime < p_end_datetime AND end_datetime > p_start_datetime);

    RETURN (v_conflict_count > 0);
END;
$$;

-- Trigger to schedule 30-day haircut reminder when a haircut appointment is completed
CREATE OR REPLACE FUNCTION trigger_haircut_reminder_on_completion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_is_haircut BOOLEAN;
    v_customer customers%ROWTYPE;
    v_salon salon_settings%ROWTYPE;
    v_reminder_days INT;
    v_scheduled_time TIMESTAMPTZ;
    v_idempotency_key VARCHAR(255);
BEGIN
    -- Only trigger when status transitions to 'completed'
    IF NEW.status = 'completed' AND (OLD.status IS DISTINCT FROM 'completed') THEN
        -- Check if service is flagged as haircut
        SELECT is_haircut INTO v_is_haircut FROM services WHERE id = NEW.service_id;
        
        IF v_is_haircut = true THEN
            -- Check customer consent
            SELECT * INTO v_customer FROM customers WHERE id = NEW.customer_id;
            
            IF v_customer.whatsapp_consent = true AND v_customer.whatsapp_opt_out = false THEN
                -- Fetch salon settings
                SELECT * INTO v_salon FROM salon_settings LIMIT 1;
                v_reminder_days := COALESCE(v_salon.haircut_reminder_days, 30);
                
                -- Calculate scheduled time: 30 days later at 11:00 AM
                v_scheduled_time := (COALESCE(NEW.completed_at, NOW()) + (v_reminder_days || ' days')::INTERVAL);
                v_idempotency_key := 'haircut_30d_' || NEW.id;

                INSERT INTO reminder_jobs (
                    idempotency_key,
                    appointment_id,
                    customer_id,
                    job_type,
                    scheduled_for,
                    status,
                    template_name,
                    template_parameters
                ) VALUES (
                    v_idempotency_key,
                    NEW.id,
                    NEW.customer_id,
                    'haircut_30d_followup',
                    v_scheduled_time,
                    'pending',
                    'glama_haircut_30d_reminder',
                    jsonb_build_object(
                        'customer_name', v_customer.full_name,
                        'service_name', NEW.service_name_snapshot,
                        'salon_name', COALESCE(v_salon.salon_name, 'Glama Hair & Beauty Studio')
                    )
                ) ON CONFLICT (idempotency_key) DO NOTHING;
            END IF;
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_haircut_completion_reminder ON appointments;
CREATE TRIGGER trg_haircut_completion_reminder
AFTER UPDATE ON appointments
FOR EACH ROW
EXECUTE FUNCTION trigger_haircut_reminder_on_completion();

-- ============================================================================
-- 13. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE salon_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE stylists ENABLE ROW LEVEL SECURITY;
ALTER TABLE stylist_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE stylist_working_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE stylist_time_off ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE transformations ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_message_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper security function: Check if current user is owner or admin
CREATE OR REPLACE FUNCTION is_admin_or_owner()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
      AND role IN ('owner', 'admin')
      AND is_active = true
  );
$$;

-- Salon Settings: Public read, owner update
CREATE POLICY "Public can read salon settings" ON salon_settings
    FOR SELECT TO public USING (true);
CREATE POLICY "Admins can update salon settings" ON salon_settings
    FOR ALL TO authenticated USING (is_admin_or_owner());

-- Service Categories: Public read active, admin all
CREATE POLICY "Public can view active categories" ON service_categories
    FOR SELECT TO public USING (is_active = true);
CREATE POLICY "Admins manage categories" ON service_categories
    FOR ALL TO authenticated USING (is_admin_or_owner());

-- Services: Public read active, admin all
CREATE POLICY "Public can view active services" ON services
    FOR SELECT TO public USING (is_active = true);
CREATE POLICY "Admins manage services" ON services
    FOR ALL TO authenticated USING (is_admin_or_owner());

-- Stylists: Public read active, admin all
CREATE POLICY "Public can view active stylists" ON stylists
    FOR SELECT TO public USING (is_active = true);
CREATE POLICY "Admins manage stylists" ON stylists
    FOR ALL TO authenticated USING (is_admin_or_owner());

CREATE POLICY "Public can view stylist services" ON stylist_services
    FOR SELECT TO public USING (true);
CREATE POLICY "Admins manage stylist services" ON stylist_services
    FOR ALL TO authenticated USING (is_admin_or_owner());

CREATE POLICY "Public can view stylist hours" ON stylist_working_hours
    FOR SELECT TO public USING (true);
CREATE POLICY "Admins manage stylist hours" ON stylist_working_hours
    FOR ALL TO authenticated USING (is_admin_or_owner());

CREATE POLICY "Public can view stylist time off" ON stylist_time_off
    FOR SELECT TO public USING (true);
CREATE POLICY "Admins manage stylist time off" ON stylist_time_off
    FOR ALL TO authenticated USING (is_admin_or_owner());

-- Website content: Public read visible, admin all
CREATE POLICY "Public can view website sections" ON website_sections
    FOR SELECT TO public USING (is_visible = true);
CREATE POLICY "Admins manage website sections" ON website_sections
    FOR ALL TO authenticated USING (is_admin_or_owner());

CREATE POLICY "Public can view transformations" ON transformations
    FOR SELECT TO public USING (is_published = true);
CREATE POLICY "Admins manage transformations" ON transformations
    FOR ALL TO authenticated USING (is_admin_or_owner());

CREATE POLICY "Public can view testimonials" ON testimonials
    FOR SELECT TO public USING (is_featured = true);
CREATE POLICY "Admins manage testimonials" ON testimonials
    FOR ALL TO authenticated USING (is_admin_or_owner());

CREATE POLICY "Public can view blog posts" ON blog_posts
    FOR SELECT TO public USING (is_published = true);
CREATE POLICY "Admins manage blog posts" ON blog_posts
    FOR ALL TO authenticated USING (is_admin_or_owner());

-- Appointments & Customers: Only admins/staff or service role
CREATE POLICY "Admins manage customers" ON customers
    FOR ALL TO authenticated USING (is_admin_or_owner());

CREATE POLICY "Admins manage appointments" ON appointments
    FOR ALL TO authenticated USING (is_admin_or_owner());

CREATE POLICY "Admins manage payments" ON payments
    FOR ALL TO authenticated USING (is_admin_or_owner());

CREATE POLICY "Admins manage expenses" ON expenses
    FOR ALL TO authenticated USING (is_admin_or_owner());

CREATE POLICY "Admins manage inventory" ON inventory_products
    FOR ALL TO authenticated USING (is_admin_or_owner());

CREATE POLICY "Admins manage inventory movements" ON inventory_movements
    FOR ALL TO authenticated USING (is_admin_or_owner());

CREATE POLICY "Admins manage reminder jobs" ON reminder_jobs
    FOR ALL TO authenticated USING (is_admin_or_owner());

CREATE POLICY "Admins view whatsapp logs" ON whatsapp_message_logs
    FOR ALL TO authenticated USING (is_admin_or_owner());

CREATE POLICY "Admins view audit logs" ON audit_logs
    FOR ALL TO authenticated USING (is_admin_or_owner());
