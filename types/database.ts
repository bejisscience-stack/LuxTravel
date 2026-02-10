// Auto-generated TypeScript types for LuxTravel Supabase Database

export type BusClass = 'VIP' | 'Comfort' | 'Standard';
export type MaintenanceStatus = 'operational' | 'maintenance' | 'out_of_service';

export type BusAmenity =
  | 'wifi'
  | 'air_conditioning'
  | 'leather_seats'
  | 'usb_charging'
  | 'entertainment_system'
  | 'toilet'
  | 'minibar'
  | 'reclining_seats'
  | 'panoramic_windows'
  | 'reading_lights';

export interface Bus {
  id: string;
  name: string;
  class: BusClass;
  capacity: number;
  description_en: string | null;
  description_ka: string | null;
  description_ru: string | null;
  amenities: BusAmenity[];
  photos: string[];
  is_active: boolean;
  maintenance_status: MaintenanceStatus;
  created_at: string;
  updated_at: string;
}

export interface SiteContent {
  id: string;
  key: string;
  value_en: string | null;
  value_ka: string | null;
  value_ru: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface GalleryImage {
  id: string;
  image_url: string;
  alt_text_en: string | null;
  alt_text_ka: string | null;
  alt_text_ru: string | null;
  sort_order: number;
  created_at: string;
}

export interface Setting {
  id: string;
  key: string;
  value: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

// Database schema type for Supabase client
export interface Database {
  public: {
    Tables: {
      buses: {
        Row: Bus;
        Insert: Omit<Bus, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Bus, 'id' | 'created_at' | 'updated_at'>>;
      };
      site_content: {
        Row: SiteContent;
        Insert: Omit<SiteContent, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<SiteContent, 'id' | 'created_at' | 'updated_at'>>;
      };
      gallery: {
        Row: GalleryImage;
        Insert: Omit<GalleryImage, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<GalleryImage, 'id' | 'created_at'>>;
      };
      settings: {
        Row: Setting;
        Insert: Omit<Setting, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Setting, 'id' | 'created_at' | 'updated_at'>>;
      };
      contact_messages: {
        Row: ContactMessage;
        Insert: Omit<ContactMessage, 'id' | 'created_at' | 'is_read'> & {
          id?: string;
          created_at?: string;
          is_read?: boolean;
        };
        Update: Partial<Pick<ContactMessage, 'is_read'>>;
      };
    };
    Views: {
      active_buses_view: {
        Row: Omit<Bus, 'is_active'>;
      };
      unread_messages_view: {
        Row: ContactMessage;
      };
    };
    Functions: {
      get_site_content: {
        Args: { content_key: string; lang?: string };
        Returns: string | null;
      };
      get_setting: {
        Args: { setting_key: string };
        Returns: string | null;
      };
      mark_message_read: {
        Args: { message_id: string };
        Returns: void;
      };
    };
  };
}

// Localized content helper type
export type Locale = 'en' | 'ka' | 'ru';

export interface LocalizedContent<T> {
  en: T;
  ka: T;
  ru: T;
}

// Helper to get localized value
export function getLocalizedValue<T>(
  item: { [K in `value_${Locale}`]?: T | null } | { [K in `${string}_${Locale}`]?: T | null },
  locale: Locale,
  prefix: string = 'value'
): T | null {
  const key = `${prefix}_${locale}` as keyof typeof item;
  return (item[key] as T) ?? null;
}
