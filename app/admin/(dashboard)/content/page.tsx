'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import type { SiteContent } from '@/types/database'
import {
  Save,
  Upload,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
  LayoutDashboard,
  Star,
  Image as ImageIcon,
} from 'lucide-react'
import styles from './page.module.css'

interface ContentItem {
  key: string
  value_en: string
  value_ka: string
  value_ru: string
  image_url: string | null
}

const contentSections = [
  {
    id: 'hero',
    title: 'Hero Section',
    icon: LayoutDashboard,
    fields: [
      { key: 'hero_title', label: 'Title', type: 'text' },
      { key: 'hero_subtitle', label: 'Subtitle', type: 'textarea' },
      { key: 'hero_image', label: 'Background Image', type: 'image' },
    ],
  },
  {
    id: 'why_choose_us',
    title: 'Why Choose Us',
    icon: Star,
    fields: [
      { key: 'why_choose_us_title', label: 'Section Title', type: 'text' },
      { key: 'why_choose_us_subtitle', label: 'Section Subtitle', type: 'textarea' },
      { key: 'feature_1_title', label: 'Feature 1 Title', type: 'text' },
      { key: 'feature_1_description', label: 'Feature 1 Description', type: 'textarea' },
      { key: 'feature_2_title', label: 'Feature 2 Title', type: 'text' },
      { key: 'feature_2_description', label: 'Feature 2 Description', type: 'textarea' },
      { key: 'feature_3_title', label: 'Feature 3 Title', type: 'text' },
      { key: 'feature_3_description', label: 'Feature 3 Description', type: 'textarea' },
    ],
  },
]

export default function ContentPage() {
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [content, setContent] = useState<Record<string, ContentItem>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'en' | 'ka' | 'ru'>('en')
  const [currentUploadKey, setCurrentUploadKey] = useState<string | null>(null)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')

      if (error) throw error

      const contentMap: Record<string, ContentItem> = {}
      data?.forEach((item: SiteContent) => {
        contentMap[item.key] = {
          key: item.key,
          value_en: item.value_en || '',
          value_ka: item.value_ka || '',
          value_ru: item.value_ru || '',
          image_url: item.image_url,
        }
      })

      // Initialize missing content keys with empty values
      contentSections.forEach((section) => {
        section.fields.forEach((field) => {
          if (!contentMap[field.key]) {
            contentMap[field.key] = {
              key: field.key,
              value_en: '',
              value_ka: '',
              value_ru: '',
              image_url: null,
            }
          }
        })
      })

      setContent(contentMap)
    } catch (err) {
      console.error('Error fetching content:', err)
      setError('Failed to load content')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (key: string, locale: 'en' | 'ka' | 'ru', value: string) => {
    setContent((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [`value_${locale}`]: value,
      },
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(key)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(filePath)

      setContent((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          image_url: publicUrl,
        },
      }))
    } catch (err) {
      console.error('Error uploading image:', err)
      setError('Failed to upload image')
    } finally {
      setIsUploading(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = async (key: string) => {
    const imageUrl = content[key]?.image_url
    if (imageUrl) {
      try {
        const urlParts = imageUrl.split('/storage/v1/object/public/site-assets/')
        if (urlParts.length > 1) {
          await supabase.storage.from('site-assets').remove([urlParts[1]])
        }
      } catch (err) {
        console.error('Error deleting image:', err)
      }
    }

    setContent((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        image_url: null,
      },
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const upsertData = Object.values(content).map((item) => ({
        key: item.key,
        value_en: item.value_en || null,
        value_ka: item.value_ka || null,
        value_ru: item.value_ru || null,
        image_url: item.image_url,
      }))

      const { error } = await supabase
        .from('site_content')
        .upsert(upsertData, { onConflict: 'key' })

      if (error) throw error

      setSuccessMessage('Content saved successfully!')
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      console.error('Error saving content:', err)
      setError('Failed to save content')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 size={32} className={styles.spinner} />
        <span>Loading content...</span>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Content Management</h1>
          <p className={styles.subtitle}>Edit website content in all languages</p>
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
              Save All Changes
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

      {/* Language Tabs */}
      <div className={styles.languageTabs}>
        <button
          onClick={() => setActiveTab('en')}
          className={`${styles.languageTab} ${activeTab === 'en' ? styles.activeTab : ''}`}
        >
          English
        </button>
        <button
          onClick={() => setActiveTab('ka')}
          className={`${styles.languageTab} ${activeTab === 'ka' ? styles.activeTab : ''}`}
        >
          Georgian
        </button>
        <button
          onClick={() => setActiveTab('ru')}
          className={`${styles.languageTab} ${activeTab === 'ru' ? styles.activeTab : ''}`}
        >
          Russian
        </button>
      </div>

      <div className={styles.sectionsGrid}>
        {contentSections.map((section) => {
          const Icon = section.icon
          return (
            <section key={section.id} className={styles.section}>
              <div className={styles.sectionHeader}>
                <Icon size={20} />
                <h2 className={styles.sectionTitle}>{section.title}</h2>
              </div>

              <div className={styles.fieldsGrid}>
                {section.fields.map((field) => {
                  if (field.type === 'image') {
                    const imageUrl = content[field.key]?.image_url
                    return (
                      <div key={field.key} className={styles.fieldGroup}>
                        <label className={styles.label}>{field.label}</label>
                        {imageUrl ? (
                          <div className={styles.imagePreview}>
                            <Image
                              src={imageUrl}
                              alt={field.label}
                              fill
                              sizes="(max-width: 768px) 100vw, 400px"
                              style={{ objectFit: 'cover' }}
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(field.key)}
                              className={styles.removeImageButton}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className={styles.uploadArea}>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, field.key)}
                              className={styles.fileInput}
                              id={`upload-${field.key}`}
                              disabled={isUploading === field.key}
                            />
                            <label htmlFor={`upload-${field.key}`} className={styles.uploadLabel}>
                              {isUploading === field.key ? (
                                <>
                                  <Loader2 size={24} className={styles.spinner} />
                                  <span>Uploading...</span>
                                </>
                              ) : (
                                <>
                                  <Upload size={24} />
                                  <span>Click to upload</span>
                                  <span className={styles.uploadHint}>PNG, JPG up to 10MB</span>
                                </>
                              )}
                            </label>
                          </div>
                        )}
                      </div>
                    )
                  }

                  const valueKey = `value_${activeTab}` as 'value_en' | 'value_ka' | 'value_ru'
                  return (
                    <div key={field.key} className={styles.fieldGroup}>
                      <label htmlFor={`${field.key}-${activeTab}`} className={styles.label}>
                        {field.label}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea
                          id={`${field.key}-${activeTab}`}
                          value={content[field.key]?.[valueKey] || ''}
                          onChange={(e) => handleInputChange(field.key, activeTab, e.target.value)}
                          className={styles.textarea}
                          rows={3}
                          placeholder={`Enter ${field.label.toLowerCase()}...`}
                        />
                      ) : (
                        <input
                          type="text"
                          id={`${field.key}-${activeTab}`}
                          value={content[field.key]?.[valueKey] || ''}
                          onChange={(e) => handleInputChange(field.key, activeTab, e.target.value)}
                          className={styles.input}
                          placeholder={`Enter ${field.label.toLowerCase()}...`}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
