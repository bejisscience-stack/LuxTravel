-- =============================================
-- SERVICES TABLE
-- =============================================
CREATE TABLE services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description_en TEXT,
    description_ka TEXT,
    description_ru TEXT,
    photos TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_services_is_active ON services(is_active);

-- Apply updated_at trigger (reuses existing function)
CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active services" ON services
    FOR SELECT
    USING (is_active = true);

CREATE POLICY "Admins can manage services" ON services
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- =============================================
-- STORAGE BUCKET
-- =============================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('service-images', 'service-images', true, 5242880,
        ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view service images" ON storage.objects
    FOR SELECT USING (bucket_id = 'service-images');

CREATE POLICY "Admins can upload service images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'service-images' AND auth.role() = 'authenticated');

CREATE POLICY "Admins can update service images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'service-images' AND auth.role() = 'authenticated');

CREATE POLICY "Admins can delete service images" ON storage.objects
    FOR DELETE USING (bucket_id = 'service-images' AND auth.role() = 'authenticated');

-- =============================================
-- VIEW
-- =============================================
CREATE OR REPLACE VIEW active_services_view AS
SELECT id, name, description_en, description_ka, description_ru, photos, created_at, updated_at
FROM services
WHERE is_active = true
ORDER BY name;

-- =============================================
-- GRANTS
-- =============================================
GRANT SELECT ON services TO anon;
GRANT ALL ON services TO authenticated;
GRANT SELECT ON active_services_view TO anon, authenticated;
