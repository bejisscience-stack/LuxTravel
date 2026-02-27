'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import type { Service } from '@/types/database'
import {
  Save,
  ArrowLeft,
  Upload,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'
import styles from './ServiceForm.module.css'

interface ServiceFormProps {
  service?: Service
  isEditing?: boolean
}

interface FormData {
  name: string
  description_en: string
  description_ka: string
  description_ru: string
  photos: string[]
  is_active: boolean
}

interface FormErrors {
  name?: string
  description_en?: string
  photos?: string
}

export default function ServiceForm({ service, isEditing = false }: ServiceFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const [formData, setFormData] = useState<FormData>({
    name: service?.name || '',
    description_en: service?.description_en || '',
    description_ka: service?.description_ka || '',
    description_ru: service?.description_ru || '',
    photos: service?.photos || [],
    is_active: service?.is_active ?? true,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Service name is required'
    }

    if (!formData.description_en.trim()) {
      newErrors.description_en = 'English description is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setUploadProgress('Uploading images...')

    try {
      const uploadedUrls: string[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        setUploadProgress(`Uploading image ${i + 1} of ${files.length}...`)

        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('service-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('service-images')
          .getPublicUrl(filePath)

        uploadedUrls.push(publicUrl)
      }

      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, ...uploadedUrls],
      }))

      setUploadProgress(null)
    } catch (error) {
      console.error('Error uploading images:', error)
      setErrors((prev) => ({ ...prev, photos: 'Failed to upload images. Please try again.' }))
    } finally {
      setIsUploading(false)
      setUploadProgress(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = async (urlToRemove: string) => {
    try {
      const urlParts = urlToRemove.split('/storage/v1/object/public/service-images/')
      if (urlParts.length > 1) {
        const filePath = urlParts[1]
        await supabase.storage.from('service-images').remove([filePath])
      }
    } catch (error) {
      console.error('Error deleting image from storage:', error)
    }

    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((url) => url !== urlToRemove),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setSuccessMessage(null)

    try {
      const serviceData = {
        name: formData.name.trim(),
        description_en: formData.description_en.trim() || null,
        description_ka: formData.description_ka.trim() || null,
        description_ru: formData.description_ru.trim() || null,
        photos: formData.photos,
        is_active: formData.is_active,
      }

      if (isEditing && service) {
        const { error } = await supabase
          .from('services')
          .update(serviceData as never)
          .eq('id', service.id)

        if (error) throw error
        setSuccessMessage('Service updated successfully!')
      } else {
        const { error } = await supabase.from('services').insert([serviceData] as never)

        if (error) throw error
        setSuccessMessage('Service created successfully!')
      }

      setTimeout(() => {
        router.push('/admin/services')
        router.refresh()
      }, 1500)
    } catch (error) {
      console.error('Error saving service:', error)
      setErrors((prev) => ({
        ...prev,
        name: 'Failed to save service. Please try again.',
      }))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <header className={styles.header}>
        <button
          type="button"
          onClick={() => router.push('/admin/services')}
          className={styles.backButton}
        >
          <ArrowLeft size={20} />
          Back to Services
        </button>
        <h1 className={styles.title}>{isEditing ? 'Edit Service' : 'Add New Service'}</h1>
      </header>

      {successMessage && (
        <div className={styles.successMessage}>
          <CheckCircle size={20} />
          {successMessage}
        </div>
      )}

      <div className={styles.formGrid}>
        {/* Basic Info Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Basic Information</h2>

          <div className={styles.fieldGroup}>
            <label htmlFor="name" className={styles.label}>
              Service Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              placeholder="e.g., Engine Diagnostics"
            />
            {errors.name && (
              <span className={styles.errorText}>
                <AlertCircle size={14} />
                {errors.name}
              </span>
            )}
          </div>

          <div className={styles.checkboxField}>
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleCheckboxChange}
              className={styles.checkbox}
            />
            <label htmlFor="is_active" className={styles.checkboxLabel}>
              Active (visible on public website)
            </label>
          </div>
        </section>

        {/* Descriptions Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Descriptions</h2>

          <div className={styles.fieldGroup}>
            <label htmlFor="description_en" className={styles.label}>
              English Description <span className={styles.required}>*</span>
            </label>
            <textarea
              id="description_en"
              name="description_en"
              value={formData.description_en}
              onChange={handleInputChange}
              className={`${styles.textarea} ${errors.description_en ? styles.inputError : ''}`}
              placeholder="Describe the service..."
              rows={4}
            />
            {errors.description_en && (
              <span className={styles.errorText}>
                <AlertCircle size={14} />
                {errors.description_en}
              </span>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="description_ka" className={styles.label}>
              Georgian Description
            </label>
            <textarea
              id="description_ka"
              name="description_ka"
              value={formData.description_ka}
              onChange={handleInputChange}
              className={styles.textarea}
              placeholder="აღწერეთ სერვისი..."
              rows={4}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="description_ru" className={styles.label}>
              Russian Description
            </label>
            <textarea
              id="description_ru"
              name="description_ru"
              value={formData.description_ru}
              onChange={handleInputChange}
              className={styles.textarea}
              placeholder="Опишите услугу..."
              rows={4}
            />
          </div>
        </section>

        {/* Photos Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Photos</h2>

          <div className={styles.uploadArea}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className={styles.fileInput}
              id="photos"
              disabled={isUploading}
            />
            <label htmlFor="photos" className={styles.uploadLabel}>
              {isUploading ? (
                <>
                  <Loader2 size={24} className={styles.spinner} />
                  <span>{uploadProgress || 'Uploading...'}</span>
                </>
              ) : (
                <>
                  <Upload size={24} />
                  <span>Click to upload images</span>
                  <span className={styles.uploadHint}>PNG, JPG up to 5MB</span>
                </>
              )}
            </label>
          </div>

          {errors.photos && (
            <span className={styles.errorText}>
              <AlertCircle size={14} />
              {errors.photos}
            </span>
          )}

          {formData.photos.length > 0 && (
            <div className={styles.photoGrid}>
              {formData.photos.map((url, index) => (
                <div key={url} className={styles.photoItem}>
                  <Image
                    src={url}
                    alt={`Service photo ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 200px"
                    style={{ objectFit: 'cover' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(url)}
                    className={styles.removePhotoButton}
                    title="Remove photo"
                  >
                    <X size={16} />
                  </button>
                  {index === 0 && <span className={styles.primaryBadge}>Primary</span>}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Submit Button */}
      <div className={styles.formActions}>
        <button
          type="button"
          onClick={() => router.push('/admin/services')}
          className={styles.cancelButton}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button type="submit" className={styles.submitButton} disabled={isSubmitting || isUploading}>
          {isSubmitting ? (
            <>
              <Loader2 size={18} className={styles.spinner} />
              {isEditing ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>
              <Save size={18} />
              {isEditing ? 'Update Service' : 'Create Service'}
            </>
          )}
        </button>
      </div>
    </form>
  )
}
