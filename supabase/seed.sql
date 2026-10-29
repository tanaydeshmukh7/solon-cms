-- ============================================================================
-- GLAMA LUXURY BEAUTY STUDIO - INITIAL SEED DATA
-- Matches Glama Reference Brand & Editorial Art Direction
-- ============================================================================

-- 1. SALON SETTINGS
INSERT INTO salon_settings (
    id,
    salon_name,
    tagline,
    phone,
    whatsapp_number,
    email,
    address,
    currency,
    currency_symbol,
    tax_percentage,
    deposit_percentage,
    booking_slot_interval_minutes,
    haircut_reminder_days,
    auto_reminders_enabled,
    instagram_url,
    facebook_url,
    pinterest_url,
    tiktok_url,
    youtube_url,
    opening_hours
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Glama Hair & Beauty Studio',
    'Beauty. Care. Confidence.',
    '+1 (123) 456-7890',
    '+11234567890',
    'hello@glamasalon.com',
    '123 Beauty Street, New York, NY 10001',
    'USD',
    '$',
    8.875,
    20.00,
    30,
    30,
    true,
    'https://instagram.com/glamasalon',
    'https://facebook.com/glamasalon',
    'https://pinterest.com/glamasalon',
    'https://tiktok.com/@glamasalon',
    'https://youtube.com/@glamasalon',
    '{
        "monday": {"open": "09:00", "close": "20:00", "closed": false},
        "tuesday": {"open": "09:00", "close": "20:00", "closed": false},
        "wednesday": {"open": "09:00", "close": "20:00", "closed": false},
        "thursday": {"open": "09:00", "close": "20:00", "closed": false},
        "friday": {"open": "09:00", "close": "20:00", "closed": false},
        "saturday": {"open": "09:00", "close": "20:00", "closed": false},
        "sunday": {"open": "10:00", "close": "18:00", "closed": false}
    }'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- 2. SERVICE CATEGORIES
INSERT INTO service_categories (id, name, slug, description, subtitle, cover_image, display_order, is_active) VALUES
('11111111-0000-0000-0000-000000000001', 'Hair Services', 'hair-services', 'Precision haircuts, bespoke styling, signature blowouts, and advanced color artistry.', 'Haircut, styling, coloring', 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800&q=80', 1, true),
('11111111-0000-0000-0000-000000000002', 'Skin Care', 'skin-care', 'Revitalizing medical-grade facials, deep pore cleansing, and glowing hydration treatments.', 'Facials, cleansing, glow', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80', 2, true),
('11111111-0000-0000-0000-000000000003', 'Makeup', 'makeup', 'Soft glam, couture red carpet looks, and celebration makeup crafted for camera and daylight.', 'Bridal, party, special events', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80', 3, true),
('11111111-0000-0000-0000-000000000004', 'Nail Care', 'nail-care', 'High-end Russian manicures, gel extensions, minimalist chrome art, and spa pedicures.', 'Manicure, pedicure, nail art', 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80', 4, true),
('11111111-0000-0000-0000-000000000005', 'Beauty Treatments', 'beauty-treatments', 'Brow laminations, lash lifts, organic waxing, and delicate facial threading.', 'Waxing, threading, etc.', 'https://images.unsplash.com/photo-1583001809873-a128495da465?auto=format&fit=crop&w=800&q=80', 5, true),
('11111111-0000-0000-0000-000000000006', 'Bridal Packages', 'bridal-packages', 'Comprehensive luxury bridal transformations, hair styling, veil setting, and trial sessions.', 'Complete bridal makeover', 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=800&q=80', 6, true)
ON CONFLICT (id) DO NOTHING;

-- 3. SERVICES
INSERT INTO services (id, category_id, name, slug, description, cover_image, price, duration_minutes, buffer_after_minutes, is_featured, is_active, is_haircut, display_order, add_ons) VALUES
-- Hair Services
('22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'Signature Haircut & Blowdry', 'signature-haircut-blowdry', 'Tailored consultation, scalp detox cleanse, customized cut, and signature bouncy blowout finish.', 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800&q=80', 85.00, 60, 15, true, true, true, 1, '[{"name": "Deep Conditioning Mask", "price": 25, "duration_minutes": 15}, {"name": "Split End Repair Treatment", "price": 35, "duration_minutes": 15}]'::jsonb),
('22222222-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', 'Balayage & Hair Gloss', 'balayage-hair-gloss', 'Hand-painted dimensional sun-kissed highlights followed by our luminous conditioning gloss treatment.', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80', 210.00, 150, 15, true, true, false, 2, '[{"name": "Olaplex Bond Builder", "price": 40, "duration_minutes": 15}, {"name": "Shadow Root Melt", "price": 30, "duration_minutes": 15}]'::jsonb),
('22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000001', 'Luxury Silk Blowout', 'luxury-silk-blowout', 'Ultra-smoothing blowout with heat defense serums and soft editorial waves.', 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=800&q=80', 60.00, 45, 15, false, true, false, 3, '[]'::jsonb),

-- Skin Care
('22222222-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000002', 'Radiant Glow Hydrating Facial', 'radiant-glow-hydrating-facial', 'Triple moisture infusion, lymphatic drainage massage, enzyme peel, and rose quartz roller calm.', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80', 110.00, 60, 15, true, true, false, 1, '[{"name": "LED Light Therapy", "price": 30, "duration_minutes": 15}, {"name": "Collagen Eye Lift Mask", "price": 20, "duration_minutes": 10}]'::jsonb),
('22222222-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000002', 'Deep Cleansing Clarifying Facial', 'deep-cleansing-clarifying-facial', 'Ultrasonic pore vacuuming, calming botanical clay mask, and probiotic barrier protection.', 'https://images.unsplash.com/photo-1512290900672-1f438a2e5871?auto=format&fit=crop&w=800&q=80', 125.00, 75, 15, false, true, false, 2, '[]'::jsonb),

-- Makeup
('22222222-0000-0000-0000-000000000006', '11111111-0000-0000-0000-000000000003', 'Celebration Glam Makeup', 'celebration-glam-makeup', 'Airbrushed radiant complexion, sculpted eye contours, mink lashes, and 16-hour setting veil.', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80', 95.00, 60, 15, true, true, false, 1, '[{"name": "Luxury Individual Lashes", "price": 25, "duration_minutes": 15}]'::jsonb),

-- Nail Care
('22222222-0000-0000-0000-000000000007', '11111111-0000-0000-0000-000000000004', 'Luxe Gel Manicure & Nail Art', 'luxe-gel-manicure-nail-art', 'E-file cuticle refinement, BIAB builder gel strength layer, and custom minimalist nail art design.', 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80', 75.00, 60, 15, true, true, false, 1, '[{"name": "Glaze Chrome Finish", "price": 15, "duration_minutes": 10}, {"name": "Paraffin Hand Treatment", "price": 20, "duration_minutes": 15}]'::jsonb),

-- Beauty Treatments
('22222222-0000-0000-0000-000000000008', '11111111-0000-0000-0000-000000000005', 'High-Definition Brow & Lash Lift', 'hd-brow-and-lash-lift', 'Keratin lash lift and tint paired with bespoke brow mapping, precision threading, and hybrid tinting.', 'https://images.unsplash.com/photo-1583001809873-a128495da465?auto=format&fit=crop&w=800&q=80', 90.00, 60, 15, false, true, false, 1, '[]'::jsonb),

-- Bridal Packages
('22222222-0000-0000-0000-000000000009', '11111111-0000-0000-0000-000000000006', 'Royal Bride Signature Makeover', 'royal-bride-signature-makeover', 'Complete bridal beauty transformation: bridal HD makeup, couture hair updo, jewelry & dupatta styling, and touch-up kit.', 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=800&q=80', 350.00, 180, 30, true, true, false, 1, '[{"name": "Pre-Wedding Bridal Trial", "price": 120, "duration_minutes": 90}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 4. STYLISTS
INSERT INTO stylists (id, name, title, bio, photo_url, experience_years, rating, review_count, display_order, is_active) VALUES
('33333333-0000-0000-0000-000000000001', 'Elena Rostova', 'Creative Hair Director', 'Celebrity stylist specializing in precision cuts, textured lived-in bobs, and dimensional European balayage.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80', 8, 4.98, 142, 1, true),
('33333333-0000-0000-0000-000000000002', 'Maya Lin', 'Master Esthetician & Skin Specialist', 'Holistic skincare artisan focusing on medical-grade facials, barrier repair, and radiant wedding prep.', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80', 6, 4.95, 98, 2, true),
('33333333-0000-0000-0000-000000000003', 'Sophia Patel', 'Senior Bridal & Glam Artist', 'Master of seamless blending, luminous camera-ready beauty, and couture bridal hair aesthetics.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80', 7, 4.99, 160, 3, true),
('33333333-0000-0000-0000-000000000004', 'Chloe Laurent', 'Lead Nail Artist & Lash Designer', 'Pioneer of high-precision Japanese & Russian nail care with delicate hand-painted motifs.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80', 5, 4.92, 86, 4, true)
ON CONFLICT (id) DO NOTHING;

-- Assign stylists to services
INSERT INTO stylist_services (stylist_id, service_id) VALUES
('33333333-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001'),
('33333333-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000002'),
('33333333-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000003'),
('33333333-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000004'),
('33333333-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000005'),
('33333333-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000006'),
('33333333-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000009'),
('33333333-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000007'),
('33333333-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000008')
ON CONFLICT DO NOTHING;

-- Stylist Working Hours (Monday through Saturday 09:00 - 20:00, Sunday 10:00 - 18:00)
DO $$
DECLARE
    s_id UUID;
    d INT;
BEGIN
    FOR s_id IN SELECT id FROM stylists LOOP
        FOR d IN 0..6 LOOP
            INSERT INTO stylist_working_hours (stylist_id, day_of_week, start_time, end_time, lunch_break_start, lunch_break_end, is_day_off)
            VALUES (
                s_id,
                d,
                CASE WHEN d = 0 THEN '10:00:00'::time ELSE '09:00:00'::time END,
                CASE WHEN d = 0 THEN '18:00:00'::time ELSE '20:00:00'::time END,
                '13:00:00'::time,
                '14:00:00'::time,
                CASE WHEN d = 1 AND s_id = '33333333-0000-0000-0000-000000000001' THEN true ELSE false END
            ) ON CONFLICT (stylist_id, day_of_week) DO NOTHING;
        END LOOP;
    END LOOP;
END $$;

-- 5. TESTIMONIALS (From Reference Image)
INSERT INTO testimonials (id, client_name, client_role, avatar_url, quote, rating, service_name, is_featured, display_order) VALUES
('44444444-0000-0000-0000-000000000001', 'Priya S.', 'Regular Client', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80', 'Absolutely love this salon! The staff is so professional and friendly. My hair and skin have never looked better!', 5, 'Signature Haircut & Glow Facial', true, 1),
('44444444-0000-0000-0000-000000000002', 'Neha K.', 'Happy Client', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', 'Best beauty salon in town! Clean, hygienic, and the results are always amazing. Highly recommend!', 5, 'Balayage & Hair Gloss', true, 2),
('44444444-0000-0000-0000-000000000003', 'Ayesha R.', 'Bridal Client', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80', 'Such a relaxing and luxurious experience. The bridal makeup was exactly what I dreamed of!', 5, 'Royal Bride Signature Makeover', true, 3)
ON CONFLICT (id) DO NOTHING;

-- 6. TRANSFORMATIONS (From Reference Image)
INSERT INTO transformations (id, title, category, before_image_url, after_image_url, description, display_order, is_published) VALUES
('55555555-0000-0000-0000-000000000001', 'Luxe Brunette Wave Makeover', 'Hair', 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=600&q=80', 'Dimensional espresso tones with butterfly layer movement.', 1, true),
('55555555-0000-0000-0000-000000000002', 'Pearl-Embellished Bridal Updo', 'Hair', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=600&q=80', 'Romantic bridal chignon woven with heirloom freshwater pearls.', 2, true),
('55555555-0000-0000-0000-000000000003', 'Velvet Bronze Evening Glam', 'Makeup', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80', 'Sculpted cheekbones, champagne highlights, and satin nude lip.', 3, true),
('55555555-0000-0000-0000-000000000004', 'Honey Blonde Lived-In Balayage', 'Hair', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=600&q=80', 'Seamless transition from dark roots to radiant warm amber highlights.', 4, true),
('55555555-0000-0000-0000-000000000005', 'Blush Chrome French Manicure', 'Nails', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80', 'Almond sculpted gel extensions with iridescent micro-pearl glaze.', 5, true),
('55555555-0000-0000-0000-000000000006', 'Royal Bridal Makeover & Hair', 'Bridal', 'https://images.unsplash.com/photo-1583001809873-a128495da465?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=600&q=80', 'Regal styling with delicate eye artistry and floral hair piece.', 6, true)
ON CONFLICT (id) DO NOTHING;
