// Database Types for LuxTravel

export interface Bus {
  id: string
  name: string
  class: string
  capacity: number
  description_en: string
  description_ka: string
  description_ru: string
  amenities: string[]
  photos: string[]
  is_active: boolean
  maintenance_status: 'available' | 'maintenance' | 'retired'
  created_at: string
  updated_at: string
}

export interface SiteContent {
  id: string
  key: string
  value_en: string
  value_ka: string
  value_ru: string
  image_url?: string
}

export interface GalleryImage {
  id: string
  image_url: string
  alt_text_en: string
  alt_text_ka: string
  alt_text_ru: string
  sort_order: number
}

export interface Setting {
  id: string
  key: string
  value: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  is_read: boolean
  created_at: string
}

// Helper types for inserting data (without auto-generated fields)
export type BusInsert = Omit<Bus, 'id' | 'created_at' | 'updated_at'>
export type SiteContentInsert = Omit<SiteContent, 'id'>
export type GalleryImageInsert = Omit<GalleryImage, 'id'>
export type SettingInsert = Omit<Setting, 'id'>
export type ContactMessageInsert = Omit<ContactMessage, 'id' | 'created_at'>

// Helper types for updating data (all fields optional except id)
export type BusUpdate = Partial<Omit<Bus, 'id' | 'created_at'>>
export type SiteContentUpdate = Partial<Omit<SiteContent, 'id'>>
export type GalleryImageUpdate = Partial<Omit<GalleryImage, 'id'>>
export type SettingUpdate = Partial<Omit<Setting, 'id'>>
export type ContactMessageUpdate = Partial<Omit<ContactMessage, 'id' | 'created_at'>>

// Language type
export type Language = 'en' | 'ka' | 'ru'

// Localized content helper
export type LocalizedField<T> = {
  [K in keyof T as K extends `${string}_en` | `${string}_ka` | `${string}_ru` ? K : never]: T[K]
}
