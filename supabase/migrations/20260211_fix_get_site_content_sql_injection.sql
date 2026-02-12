-- Fix SQL injection vulnerability in get_site_content function.
-- The `lang` parameter was interpolated directly into dynamic SQL via format('%s'),
-- allowing arbitrary SQL if called with a crafted lang value.
-- This version validates lang against the allowed set before executing.

CREATE OR REPLACE FUNCTION get_site_content(content_key TEXT, lang TEXT DEFAULT 'en')
RETURNS TEXT AS $$
DECLARE
    result TEXT;
BEGIN
    IF lang NOT IN ('en', 'ka', 'ru') THEN
        RAISE EXCEPTION 'Invalid language: %. Allowed values: en, ka, ru', lang;
    END IF;

    EXECUTE format('SELECT value_%I FROM site_content WHERE key = $1', lang)
    INTO result
    USING content_key;

    RETURN result;
END;
$$ LANGUAGE plpgsql;
