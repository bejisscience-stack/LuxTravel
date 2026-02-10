-- =============================================
-- LuxTravel Database Schema for Supabase
-- =============================================

-- Use gen_random_uuid() which is built into PostgreSQL 13+

-- =============================================
-- 1. BUSES TABLE
-- =============================================
CREATE TABLE buses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    class VARCHAR(50) NOT NULL CHECK (class IN ('VIP', 'Comfort', 'Standard')),
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    description_en TEXT,
    description_ka TEXT,
    description_ru TEXT,
    amenities JSONB DEFAULT '[]'::jsonb,
    photos TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    maintenance_status VARCHAR(50) DEFAULT 'operational' CHECK (maintenance_status IN ('operational', 'maintenance', 'out_of_service')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries on active buses
CREATE INDEX idx_buses_is_active ON buses(is_active);
CREATE INDEX idx_buses_class ON buses(class);

-- =============================================
-- 2. SITE_CONTENT TABLE
-- =============================================
CREATE TABLE site_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value_en TEXT,
    value_ka TEXT,
    value_ru TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster key lookups
CREATE INDEX idx_site_content_key ON site_content(key);

-- =============================================
-- 3. GALLERY TABLE
-- =============================================
CREATE TABLE gallery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url TEXT NOT NULL,
    alt_text_en VARCHAR(255),
    alt_text_ka VARCHAR(255),
    alt_text_ru VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for sorting
CREATE INDEX idx_gallery_sort_order ON gallery(sort_order);

-- =============================================
-- 4. SETTINGS TABLE
-- =============================================
CREATE TABLE settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster key lookups
CREATE INDEX idx_settings_key ON settings(key);

-- =============================================
-- 5. CONTACT_MESSAGES TABLE
-- =============================================
CREATE TABLE contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for unread messages
CREATE INDEX idx_contact_messages_is_read ON contact_messages(is_read);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- =============================================
-- UPDATED_AT TRIGGER FUNCTION
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_buses_updated_at
    BEFORE UPDATE ON buses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_content_updated_at
    BEFORE UPDATE ON site_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- BUSES POLICIES
-- Public can read active buses
CREATE POLICY "Public can view active buses" ON buses
    FOR SELECT
    USING (is_active = true);

-- Authenticated users (admin) can do everything
CREATE POLICY "Admins can manage buses" ON buses
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- SITE_CONTENT POLICIES
-- Public can read all site content
CREATE POLICY "Public can view site content" ON site_content
    FOR SELECT
    USING (true);

-- Authenticated users (admin) can manage
CREATE POLICY "Admins can manage site content" ON site_content
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- GALLERY POLICIES
-- Public can view gallery
CREATE POLICY "Public can view gallery" ON gallery
    FOR SELECT
    USING (true);

-- Authenticated users (admin) can manage
CREATE POLICY "Admins can manage gallery" ON gallery
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- SETTINGS POLICIES
-- Public can read settings
CREATE POLICY "Public can view settings" ON settings
    FOR SELECT
    USING (true);

-- Authenticated users (admin) can manage
CREATE POLICY "Admins can manage settings" ON settings
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- CONTACT_MESSAGES POLICIES
-- Anyone can insert contact messages
CREATE POLICY "Anyone can submit contact messages" ON contact_messages
    FOR INSERT
    WITH CHECK (true);

-- Only authenticated users can read/update
CREATE POLICY "Admins can view contact messages" ON contact_messages
    FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can update contact messages" ON contact_messages
    FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- =============================================
-- STORAGE BUCKETS
-- Run these in the Supabase Dashboard SQL Editor
-- or use the Supabase client
-- =============================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
    ('bus-images', 'bus-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
    ('gallery', 'gallery', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
    ('site-assets', 'site-assets', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'video/mp4'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies for bus-images bucket
CREATE POLICY "Public can view bus images" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'bus-images');

CREATE POLICY "Admins can upload bus images" ON storage.objects
    FOR INSERT
    WITH CHECK (bucket_id = 'bus-images' AND auth.role() = 'authenticated');

CREATE POLICY "Admins can update bus images" ON storage.objects
    FOR UPDATE
    USING (bucket_id = 'bus-images' AND auth.role() = 'authenticated');

CREATE POLICY "Admins can delete bus images" ON storage.objects
    FOR DELETE
    USING (bucket_id = 'bus-images' AND auth.role() = 'authenticated');

-- Storage policies for gallery bucket
CREATE POLICY "Public can view gallery images" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'gallery');

CREATE POLICY "Admins can upload gallery images" ON storage.objects
    FOR INSERT
    WITH CHECK (bucket_id = 'gallery' AND auth.role() = 'authenticated');

CREATE POLICY "Admins can update gallery images" ON storage.objects
    FOR UPDATE
    USING (bucket_id = 'gallery' AND auth.role() = 'authenticated');

CREATE POLICY "Admins can delete gallery images" ON storage.objects
    FOR DELETE
    USING (bucket_id = 'gallery' AND auth.role() = 'authenticated');

-- Storage policies for site-assets bucket
CREATE POLICY "Public can view site assets" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'site-assets');

CREATE POLICY "Admins can upload site assets" ON storage.objects
    FOR INSERT
    WITH CHECK (bucket_id = 'site-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Admins can update site assets" ON storage.objects
    FOR UPDATE
    USING (bucket_id = 'site-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Admins can delete site assets" ON storage.objects
    FOR DELETE
    USING (bucket_id = 'site-assets' AND auth.role() = 'authenticated');

-- =============================================
-- DEFAULT DATA INSERTS
-- =============================================

-- Default site content
INSERT INTO site_content (key, value_en, value_ka, value_ru, image_url) VALUES
    ('hero_title', 'Premium Bus Charter Services', 'პრემიუმ ავტობუსის ქართერის სერვისები', 'Премиум услуги автобусного чартера', NULL),
    ('hero_subtitle', 'Experience luxury travel across Georgia', 'განიცადეთ ფუფუნებით მოგზაურობა საქართველოში', 'Путешествуйте по Грузии с комфортом', NULL),
    ('about_title', 'About LuxTravel', 'ჩვენ შესახებ', 'О нас', NULL),
    ('about_description', 'LuxTravel is Georgia''s premier bus charter company, offering luxury transportation services for corporate events, tours, and special occasions. With our modern fleet and professional drivers, we ensure a comfortable and safe journey every time.', 'LuxTravel არის საქართველოს წამყვანი ავტობუსის ქართერის კომპანია, რომელიც გთავაზობთ ფუფუნების ტრანსპორტირების სერვისებს კორპორატიული ღონისძიებებისთვის, ტურებისთვის და განსაკუთრებული შემთხვევებისთვის.', 'LuxTravel - ведущая грузинская компания по чартеру автобусов, предлагающая услуги премиум-класса для корпоративных мероприятий, туров и особых случаев.', NULL),
    ('services_title', 'Our Services', 'ჩვენი სერვისები', 'Наши услуги', NULL),
    ('fleet_title', 'Our Fleet', 'ჩვენი ფლოტი', 'Наш автопарк', NULL),
    ('contact_title', 'Contact Us', 'დაგვიკავშირდით', 'Связаться с нами', NULL),
    ('contact_address', '123 Rustaveli Avenue, Tbilisi, Georgia', 'რუსთაველის გამზ. 123, თბილისი, საქართველო', 'пр. Руставели 123, Тбилиси, Грузия', NULL),
    ('footer_text', '© 2024 LuxTravel. All rights reserved.', '© 2024 LuxTravel. ყველა უფლება დაცულია.', '© 2024 LuxTravel. Все права защищены.', NULL)
ON CONFLICT (key) DO NOTHING;

-- Default settings
INSERT INTO settings (key, value) VALUES
    ('company_phone', '+995 555 123 456'),
    ('company_email', 'info@luxtravel.ge'),
    ('company_address', '123 Rustaveli Avenue, Tbilisi, Georgia'),
    ('social_facebook', 'https://facebook.com/luxtravel'),
    ('social_instagram', 'https://instagram.com/luxtravel'),
    ('working_hours', '{"monday": "09:00-18:00", "tuesday": "09:00-18:00", "wednesday": "09:00-18:00", "thursday": "09:00-18:00", "friday": "09:00-18:00", "saturday": "10:00-16:00", "sunday": "closed"}'),
    ('default_language', 'en'),
    ('available_languages', '["en", "ka", "ru"]'),
    ('currency', 'GEL'),
    ('maintenance_mode', 'false')
ON CONFLICT (key) DO NOTHING;

-- Sample bus data
INSERT INTO buses (name, class, capacity, description_en, description_ka, description_ru, amenities, photos, is_active) VALUES
    (
        'Mercedes-Benz Tourismo',
        'VIP',
        50,
        'Experience ultimate luxury with our flagship Mercedes-Benz Tourismo. Featuring leather seats, personal entertainment systems, and premium amenities.',
        'განიცადეთ უმაღლესი ფუფუნება ჩვენი ფლაგმანი Mercedes-Benz Tourismo-ით. ტყავის სავარძლები, პირადი გასართობი სისტემები და პრემიუმ კომფორტი.',
        'Испытайте роскошь с нашим флагманским Mercedes-Benz Tourismo. Кожаные сиденья, персональные развлекательные системы и премиум удобства.',
        '["wifi", "air_conditioning", "leather_seats", "usb_charging", "entertainment_system", "toilet", "minibar", "reclining_seats"]'::jsonb,
        ARRAY[]::TEXT[],
        true
    ),
    (
        'Setra S 516 HDH',
        'VIP',
        48,
        'The Setra S 516 HDH offers exceptional comfort with its spacious interior, panoramic windows, and state-of-the-art technology.',
        'Setra S 516 HDH გთავაზობთ განსაკუთრებულ კომფორტს თავისი ვრცელი ინტერიერით, პანორამული ფანჯრებით და თანამედროვე ტექნოლოგიით.',
        'Setra S 516 HDH предлагает исключительный комфорт с просторным интерьером, панорамными окнами и современными технологиями.',
        '["wifi", "air_conditioning", "leather_seats", "usb_charging", "entertainment_system", "toilet", "panoramic_windows"]'::jsonb,
        ARRAY[]::TEXT[],
        true
    ),
    (
        'MAN Lion''s Coach',
        'Comfort',
        55,
        'Our MAN Lion''s Coach provides reliable comfort for medium to large groups. Perfect for corporate events and tours.',
        'ჩვენი MAN Lion''s Coach უზრუნველყოფს საიმედო კომფორტს საშუალო და დიდი ჯგუფებისთვის. იდეალურია კორპორატიული ღონისძიებებისთვის.',
        'Наш MAN Lion''s Coach обеспечивает надежный комфорт для средних и больших групп. Идеально подходит для корпоративных мероприятий.',
        '["wifi", "air_conditioning", "usb_charging", "toilet", "reclining_seats"]'::jsonb,
        ARRAY[]::TEXT[],
        true
    ),
    (
        'Volvo 9700',
        'Comfort',
        52,
        'The Volvo 9700 combines Scandinavian design with comfort and safety. An excellent choice for long-distance travel.',
        'Volvo 9700 აერთიანებს სკანდინავიურ დიზაინს კომფორტთან და უსაფრთხოებასთან. შესანიშნავი არჩევანი შორ მანძილებზე მოგზაურობისთვის.',
        'Volvo 9700 сочетает скандинавский дизайн с комфортом и безопасностью. Отличный выбор для дальних поездок.',
        '["wifi", "air_conditioning", "usb_charging", "toilet", "reclining_seats", "reading_lights"]'::jsonb,
        ARRAY[]::TEXT[],
        true
    ),
    (
        'Iveco Magelys',
        'Standard',
        60,
        'Our Iveco Magelys offers reliable transportation for larger groups at an affordable price without compromising on comfort.',
        'ჩვენი Iveco Magelys გთავაზობთ საიმედო ტრანსპორტირებას დიდი ჯგუფებისთვის ხელმისაწვდომ ფასად კომფორტზე კომპრომისის გარეშე.',
        'Наш Iveco Magelys предлагает надежную перевозку для больших групп по доступной цене без ущерба для комфорта.',
        '["air_conditioning", "usb_charging", "reclining_seats"]'::jsonb,
        ARRAY[]::TEXT[],
        true
    )
ON CONFLICT DO NOTHING;

-- =============================================
-- HELPFUL VIEWS
-- =============================================

-- View for active buses with formatted data
CREATE OR REPLACE VIEW active_buses_view AS
SELECT
    id,
    name,
    class,
    capacity,
    description_en,
    description_ka,
    description_ru,
    amenities,
    photos,
    maintenance_status,
    created_at,
    updated_at
FROM buses
WHERE is_active = true
ORDER BY
    CASE class
        WHEN 'VIP' THEN 1
        WHEN 'Comfort' THEN 2
        WHEN 'Standard' THEN 3
    END,
    name;

-- View for unread contact messages
CREATE OR REPLACE VIEW unread_messages_view AS
SELECT *
FROM contact_messages
WHERE is_read = false
ORDER BY created_at DESC;

-- =============================================
-- FUNCTIONS FOR COMMON OPERATIONS
-- =============================================

-- Function to get site content by key
CREATE OR REPLACE FUNCTION get_site_content(content_key TEXT, lang TEXT DEFAULT 'en')
RETURNS TEXT AS $$
DECLARE
    result TEXT;
BEGIN
    EXECUTE format('SELECT value_%s FROM site_content WHERE key = $1', lang)
    INTO result
    USING content_key;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to get setting by key
CREATE OR REPLACE FUNCTION get_setting(setting_key TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN (SELECT value FROM settings WHERE key = setting_key);
END;
$$ LANGUAGE plpgsql;

-- Function to mark message as read
CREATE OR REPLACE FUNCTION mark_message_read(message_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE contact_messages SET is_read = true WHERE id = message_id;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- GRANT PERMISSIONS
-- =============================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant permissions on tables
GRANT SELECT ON buses TO anon;
GRANT ALL ON buses TO authenticated;

GRANT SELECT ON site_content TO anon;
GRANT ALL ON site_content TO authenticated;

GRANT SELECT ON gallery TO anon;
GRANT ALL ON gallery TO authenticated;

GRANT SELECT ON settings TO anon;
GRANT ALL ON settings TO authenticated;

GRANT INSERT ON contact_messages TO anon;
GRANT ALL ON contact_messages TO authenticated;

-- Grant permissions on views
GRANT SELECT ON active_buses_view TO anon, authenticated;
GRANT SELECT ON unread_messages_view TO authenticated;

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION get_site_content TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_setting TO anon, authenticated;
GRANT EXECUTE ON FUNCTION mark_message_read TO authenticated;
