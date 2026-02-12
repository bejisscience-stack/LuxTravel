'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Setting } from '@/types/database'
import {
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Facebook,
  Instagram,
  Music2,
} from 'lucide-react'
import styles from './page.module.css'

interface SettingsData {
  // Contact Info
  phone: string
  email: string
  address: string
  whatsapp: string
  // Social Media
  facebook: string
  instagram: string
  tiktok: string
}

const settingsConfig = [
  {
    id: 'contact',
    title: 'Contact Information',
    fields: [
      { key: 'phone', label: 'Phone Number', icon: Phone, placeholder: '+995 XXX XXX XXX' },
      { key: 'email', label: 'Email Address', icon: Mail, placeholder: 'info@luxtravel.ge' },
      { key: 'address', label: 'Address', icon: MapPin, placeholder: 'Tbilisi, Georgia' },
      { key: 'whatsapp', label: 'WhatsApp Number', icon: MessageCircle, placeholder: '+995 XXX XXX XXX' },
    ],
  },
  {
    id: 'social',
    title: 'Social Media',
    fields: [
      { key: 'facebook', label: 'Facebook URL', icon: Facebook, placeholder: 'https://facebook.com/luxtravel' },
      { key: 'instagram', label: 'Instagram URL', icon: Instagram, placeholder: 'https://instagram.com/luxtravel' },
      { key: 'tiktok', label: 'TikTok URL', icon: Music2, placeholder: 'https://tiktok.com/@luxtravel' },
    ],
  },
]

const defaultSettings: SettingsData = {
  phone: '',
  email: '',
  address: '',
  whatsapp: '',
  facebook: '',
  instagram: '',
  tiktok: '',
}

export default function SettingsPage() {
  const supabase = createClient()

  const [settings, setSettings] = useState<SettingsData>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')

      if (error) throw error

      const settingsMap: SettingsData = { ...defaultSettings }
      data?.forEach((item: Setting) => {
        if (item.key in settingsMap) {
          settingsMap[item.key as keyof SettingsData] = item.value || ''
        }
      })

      setSettings(settingsMap)
    } catch (err) {
      console.error('Error fetching settings:', err)
      setError('Failed to load settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (key: keyof SettingsData, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const upsertData = Object.entries(settings).map(([key, value]) => ({
        key,
        value: value || null,
      }))

      const { error } = await supabase
        .from('settings')
        .upsert(upsertData as never, { onConflict: 'key' })

      if (error) throw error

      setSuccessMessage('Settings saved successfully!')
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      console.error('Error saving settings:', err)
      setError('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 size={32} className={styles.spinner} />
        <span>Loading settings...</span>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Settings</h1>
          <p className={styles.subtitle}>Manage contact information and social media links</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={styles.saveButton}
        >
          {isSaving ? (
            <>
              <Loader2 size={18} className={styles.spinner} />
              Saving...
            </>
          ) : (
            <>
              <Save size={18} />
              Save Changes
            </>
          )}
        </button>
      </header>

      {successMessage && (
        <div className={styles.successMessage}>
          <CheckCircle size={20} />
          {successMessage}
        </div>
      )}

      {error && (
        <div className={styles.errorMessage}>
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <div className={styles.sectionsGrid}>
        {settingsConfig.map((section) => (
          <section key={section.id} className={styles.section}>
            <h2 className={styles.sectionTitle}>{section.title}</h2>

            <div className={styles.fieldsGrid}>
              {section.fields.map((field) => {
                const Icon = field.icon
                return (
                  <div key={field.key} className={styles.fieldGroup}>
                    <label htmlFor={field.key} className={styles.label}>
                      <Icon size={16} />
                      {field.label}
                    </label>
                    <input
                      type={field.key === 'email' ? 'email' : 'text'}
                      id={field.key}
                      value={settings[field.key as keyof SettingsData]}
                      onChange={(e) => handleInputChange(field.key as keyof SettingsData, e.target.value)}
                      className={styles.input}
                      placeholder={field.placeholder}
                    />
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Preview Card */}
      <section className={styles.previewSection}>
        <h2 className={styles.sectionTitle}>Preview</h2>
        <div className={styles.previewCard}>
          <div className={styles.previewGroup}>
            <h4>Contact Info</h4>
            {settings.phone && (
              <p><Phone size={14} /> {settings.phone}</p>
            )}
            {settings.email && (
              <p><Mail size={14} /> {settings.email}</p>
            )}
            {settings.address && (
              <p><MapPin size={14} /> {settings.address}</p>
            )}
            {settings.whatsapp && (
              <p><MessageCircle size={14} /> {settings.whatsapp}</p>
            )}
            {!settings.phone && !settings.email && !settings.address && !settings.whatsapp && (
              <p className={styles.previewEmpty}>No contact info set</p>
            )}
          </div>
          <div className={styles.previewGroup}>
            <h4>Social Media</h4>
            {settings.facebook && (
              <p><Facebook size={14} /> Facebook</p>
            )}
            {settings.instagram && (
              <p><Instagram size={14} /> Instagram</p>
            )}
            {settings.tiktok && (
              <p><Music2 size={14} /> TikTok</p>
            )}
            {!settings.facebook && !settings.instagram && !settings.tiktok && (
              <p className={styles.previewEmpty}>No social links set</p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
