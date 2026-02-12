'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import type { Bus, BusClass, BusAmenity, MaintenanceStatus } from '@/types/database'
import {
  Save,
  ArrowLeft,
  Upload,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
  Wifi,
  Wind,
  Sofa,
  Usb,
  Monitor,
  DoorOpen,
  Wine,
  ChevronDown,
  Lightbulb,
  Sparkles,
} from 'lucide-react'
import styles from './BusForm.module.css'

interface BusFormProps {
  bus?: Bus
  isEditing?: boolean
}

const busClasses: BusClass[] = ['VIP', 'Comfort', 'Standard']
const maintenanceStatuses: { value: MaintenanceStatus; label: string }[] = [
  { value: 'operational', label: 'Operational' },
  { value: 'maintenance', label: 'In Maintenance' },
  { value: 'out_of_service', label: 'Out of Service' },
]

const amenityOptions: { value: BusAmenity; label: string; icon: typeof Wifi }[] = [
  { value: 'wifi', label: 'WiFi', icon: Wifi },
  { value: 'air_conditioning', label: 'Air Conditioning', icon: Wind },
  { value: 'leather_seats', label: 'Leather Seats', icon: Sofa },
  { value: 'usb_charging', label: 'USB Charging', icon: Usb },
  { value: 'entertainment_system', label: 'Entertainment System', icon: Monitor },
  { value: 'toilet', label: 'Toilet', icon: DoorOpen },
  { value: 'minibar', label: 'Minibar', icon: Wine },
  { value: 'reclining_seats', label: 'Reclining Seats', icon: ChevronDown },
  { value: 'panoramic_windows', label: 'Panoramic Windows', icon: Sparkles },
  { value: 'reading_lights', label: 'Reading Lights', icon: Lightbulb },
]

interface FormData {
  name: string
  class: BusClass
  capacity: number
  description_en: string
  description_ka: string
  description_ru: string
  amenities: BusAmenity[]
  photos: string[]
  is_active: boolean
  maintenance_status: MaintenanceStatus
}

interface FormErrors {
  name?: string
  capacity?: string
  description_en?: string
  photos?: string
}

export default function BusForm({ bus, isEditing = false }: BusFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const [formData, setFormData] = useState<FormData>({
    name: bus?.name || '',
    class: bus?.class || 'Standard',
    capacity: bus?.capacity || 20,
    description_en: bus?.description_en || '',
    description_ka: bus?.description_ka || '',
    description_ru: bus?.description_ru || '',
    amenities: bus?.amenities || [],
    photos: bus?.photos || [],
    is_active: bus?.is_active ?? true,
    maintenance_status: bus?.maintenance_status || 'operational',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Bus name is required'
    }

    if (formData.capacity < 1 || formData.capacity > 100) {
      newErrors.capacity = 'Capacity must be between 1 and 100'
    }

    if (!formData.description_en.trim()) {
      newErrors.description_en = 'English description is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    }))

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleAmenityToggle = (amenity: BusAmenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }))
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

        // Generate unique filename
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('bus-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) throw uploadError

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('bus-images')
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
    // Extract file path from URL to delete from storage
    try {
      const urlParts = urlToRemove.split('/storage/v1/object/public/bus-images/')
      if (urlParts.length > 1) {
        const filePath = urlParts[1]
        await supabase.storage.from('bus-images').remove([filePath])
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
      const busData = {
        name: formData.name.trim(),
        class: formData.class,
        capacity: formData.capacity,
        description_en: formData.description_en.trim() || null,
        description_ka: formData.description_ka.trim() || null,
        description_ru: formData.description_ru.trim() || null,
        amenities: formData.amenities,
        photos: formData.photos,
        is_active: formData.is_active,
        maintenance_status: formData.maintenance_status,
      }

      if (isEditing && bus) {
        const { error } = await supabase
          .from('buses')
          .update(busData as never)
          .eq('id', bus.id)

        if (error) throw error
        setSuccessMessage('Bus updated successfully!')
      } else {
        const { error } = await supabase.from('buses').insert([busData] as never)

        if (error) throw error
        setSuccessMessage('Bus created successfully!')
      }

      // Redirect after short delay to show success message
      setTimeout(() => {
        router.push('/admin/buses')
        router.refresh()
      }, 1500)
    } catch (error) {
      console.error('Error saving bus:', error)
      setErrors((prev) => ({
        ...prev,
        name: 'Failed to save bus. Please try again.',
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
          onClick={() => router.push('/admin/buses')}
          className={styles.backButton}
        >
          <ArrowLeft size={20} />
          Back to Buses
        </button>
        <h1 className={styles.title}>{isEditing ? 'Edit Bus' : 'Add New Bus'}</h1>
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
              Bus Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              placeholder="e.g., Mercedes Tourismo VIP"
            />
            {errors.name && (
              <span className={styles.errorText}>
                <AlertCircle size={14} />
                {errors.name}
              </span>
            )}
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup}>
              <label htmlFor="class" className={styles.label}>
                Class
              </label>
              <select
                id="class"
                name="class"
                value={formData.class}
                onChange={handleInputChange}
                className={styles.select}
              >
                {busClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="capacity" className={styles.label}>
                Capacity <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.capacity ? styles.inputError : ''}`}
                min={1}
                max={100}
              />
              {errors.capacity && (
                <span className={styles.errorText}>
                  <AlertCircle size={14} />
                  {errors.capacity}
                </span>
              )}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="maintenance_status" className={styles.label}>
              Maintenance Status
            </label>
            <select
              id="maintenance_status"
              name="maintenance_status"
              value={formData.maintenance_status}
              onChange={handleInputChange}
              className={styles.select}
            >
              {maintenanceStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
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
              placeholder="Describe the bus features and experience..."
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
              placeholder="აღწერეთ ავტობუსის მახასიათებლები..."
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
              placeholder="Опишите характеристики автобуса..."
              rows={4}
            />
          </div>
        </section>

        {/* Amenities Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Amenities</h2>
          <div className={styles.amenitiesGrid}>
            {amenityOptions.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleAmenityToggle(value)}
                className={`${styles.amenityButton} ${
                  formData.amenities.includes(value) ? styles.amenityActive : ''
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
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
                  <span className={styles.uploadHint}>PNG, JPG up to 10MB</span>
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
                    alt={`Bus photo ${index + 1}`}
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
          onClick={() => router.push('/admin/buses')}
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
              {isEditing ? 'Update Bus' : 'Create Bus'}
            </>
          )}
        </button>
      </div>
    </form>
  )
}
