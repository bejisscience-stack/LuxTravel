'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import type { GalleryImage } from '@/types/database'
import {
  Upload,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
  GripVertical,
  Trash2,
  Edit2,
  Save,
  Plus,
} from 'lucide-react'
import styles from './page.module.css'

interface EditingImage {
  id: string
  alt_text_en: string
  alt_text_ka: string
  alt_text_ru: string
}

export default function GalleryPage() {
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [images, setImages] = useState<GalleryImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [editingImage, setEditingImage] = useState<EditingImage | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [dragOverItem, setDragOverItem] = useState<string | null>(null)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw error
      setImages(data || [])
    } catch (err) {
      console.error('Error fetching gallery:', err)
      setError('Failed to load gallery images')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setError(null)

    try {
      const maxSortOrder = images.length > 0
        ? Math.max(...images.map(img => img.sort_order))
        : 0

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        setUploadProgress(`Uploading image ${i + 1} of ${files.length}...`)

        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('gallery')
          .getPublicUrl(filePath)

        const { error: insertError } = await supabase
          .from('gallery')
          .insert({
            image_url: publicUrl,
            sort_order: maxSortOrder + i + 1,
            alt_text_en: '',
            alt_text_ka: '',
            alt_text_ru: '',
          } as never)

        if (insertError) throw insertError
      }

      setSuccessMessage(`${files.length} image(s) uploaded successfully!`)
      setTimeout(() => setSuccessMessage(null), 3000)
      fetchImages()
    } catch (err) {
      console.error('Error uploading images:', err)
      setError('Failed to upload images. Please try again.')
    } finally {
      setIsUploading(false)
      setUploadProgress(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDelete = async (id: string) => {
    const image = images.find(img => img.id === id)
    if (!image) return

    try {
      // Delete from storage
      const urlParts = image.image_url.split('/storage/v1/object/public/gallery/')
      if (urlParts.length > 1) {
        await supabase.storage.from('gallery').remove([urlParts[1]])
      }

      // Delete from database
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id)

      if (error) throw error

      setImages(prev => prev.filter(img => img.id !== id))
      setDeleteConfirm(null)
      setSuccessMessage('Image deleted successfully!')
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      console.error('Error deleting image:', err)
      setError('Failed to delete image')
    }
  }

  const handleEditStart = (image: GalleryImage) => {
    setEditingImage({
      id: image.id,
      alt_text_en: image.alt_text_en || '',
      alt_text_ka: image.alt_text_ka || '',
      alt_text_ru: image.alt_text_ru || '',
    })
  }

  const handleEditSave = async () => {
    if (!editingImage) return

    try {
      const { error } = await supabase
        .from('gallery')
        .update({
          alt_text_en: editingImage.alt_text_en || null,
          alt_text_ka: editingImage.alt_text_ka || null,
          alt_text_ru: editingImage.alt_text_ru || null,
        } as never)
        .eq('id', editingImage.id)

      if (error) throw error

      setImages(prev => prev.map(img =>
        img.id === editingImage.id
          ? {
              ...img,
              alt_text_en: editingImage.alt_text_en || null,
              alt_text_ka: editingImage.alt_text_ka || null,
              alt_text_ru: editingImage.alt_text_ru || null,
            }
          : img
      ))
      setEditingImage(null)
      setSuccessMessage('Alt text updated successfully!')
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      console.error('Error updating alt text:', err)
      setError('Failed to update alt text')
    }
  }

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault()
    if (id !== draggedItem) {
      setDragOverItem(id)
    }
  }

  const handleDragLeave = () => {
    setDragOverItem(null)
  }

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    setDragOverItem(null)

    if (!draggedItem || draggedItem === targetId) {
      setDraggedItem(null)
      return
    }

    const draggedIndex = images.findIndex(img => img.id === draggedItem)
    const targetIndex = images.findIndex(img => img.id === targetId)

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedItem(null)
      return
    }

    // Reorder images locally
    const newImages = [...images]
    const [draggedImage] = newImages.splice(draggedIndex, 1)
    newImages.splice(targetIndex, 0, draggedImage)

    // Update sort_order for all affected images
    const updatedImages = newImages.map((img, index) => ({
      ...img,
      sort_order: index + 1,
    }))

    setImages(updatedImages)
    setDraggedItem(null)

    // Update in database
    try {
      const updates = updatedImages.map(img => ({
        id: img.id,
        sort_order: img.sort_order,
      }))

      for (const update of updates) {
        await supabase
          .from('gallery')
          .update({ sort_order: update.sort_order } as never)
          .eq('id', update.id)
      }
    } catch (err) {
      console.error('Error updating sort order:', err)
      setError('Failed to save new order')
      fetchImages() // Revert to original order
    }
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    setDragOverItem(null)
  }

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 size={32} className={styles.spinner} />
        <span>Loading gallery...</span>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Gallery Management</h1>
          <p className={styles.subtitle}>Upload and organize gallery images</p>
        </div>
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
          <button onClick={() => setError(null)} className={styles.dismissError}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Upload Section */}
      <section className={styles.uploadSection}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className={styles.fileInput}
          id="gallery-upload"
          disabled={isUploading}
        />
        <label htmlFor="gallery-upload" className={styles.uploadLabel}>
          {isUploading ? (
            <>
              <Loader2 size={32} className={styles.spinner} />
              <span className={styles.uploadText}>{uploadProgress || 'Uploading...'}</span>
            </>
          ) : (
            <>
              <div className={styles.uploadIcon}>
                <Plus size={24} />
              </div>
              <span className={styles.uploadText}>Upload Images</span>
              <span className={styles.uploadHint}>Drag and drop or click to select. PNG, JPG up to 10MB</span>
            </>
          )}
        </label>
      </section>

      {/* Gallery Grid */}
      {images.length === 0 ? (
        <div className={styles.emptyState}>
          <Upload size={48} />
          <h3>No images yet</h3>
          <p>Upload your first image to get started</p>
        </div>
      ) : (
        <>
          <p className={styles.dragHint}>
            <GripVertical size={16} />
            Drag and drop to reorder images
          </p>
          <div className={styles.galleryGrid}>
            {images.map((image) => (
              <div
                key={image.id}
                className={`${styles.galleryItem} ${draggedItem === image.id ? styles.dragging : ''} ${dragOverItem === image.id ? styles.dragOver : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, image.id)}
                onDragOver={(e) => handleDragOver(e, image.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, image.id)}
                onDragEnd={handleDragEnd}
              >
                <div className={styles.dragHandle}>
                  <GripVertical size={16} />
                </div>
                <div className={styles.imageWrapper}>
                  <Image
                    src={image.image_url}
                    alt={image.alt_text_en || 'Gallery image'}
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className={styles.itemActions}>
                  <button
                    onClick={() => handleEditStart(image)}
                    className={styles.actionButton}
                    title="Edit alt text"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(image.id)}
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    title="Delete image"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                {image.alt_text_en && (
                  <div className={styles.altTextPreview}>
                    {image.alt_text_en}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Edit Modal */}
      {editingImage && (
        <div className={styles.modalOverlay} onClick={() => setEditingImage(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Edit Alt Text</h3>
              <button onClick={() => setEditingImage(null)} className={styles.modalClose}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>English</label>
                <input
                  type="text"
                  value={editingImage.alt_text_en}
                  onChange={(e) => setEditingImage(prev => prev ? { ...prev, alt_text_en: e.target.value } : null)}
                  className={styles.input}
                  placeholder="Describe the image in English..."
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Georgian</label>
                <input
                  type="text"
                  value={editingImage.alt_text_ka}
                  onChange={(e) => setEditingImage(prev => prev ? { ...prev, alt_text_ka: e.target.value } : null)}
                  className={styles.input}
                  placeholder="აღწერეთ სურათი ქართულად..."
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Russian</label>
                <input
                  type="text"
                  value={editingImage.alt_text_ru}
                  onChange={(e) => setEditingImage(prev => prev ? { ...prev, alt_text_ru: e.target.value } : null)}
                  className={styles.input}
                  placeholder="Опишите изображение на русском..."
                />
              </div>
            </div>
            <div className={styles.modalActions}>
              <button onClick={() => setEditingImage(null)} className={styles.cancelButton}>
                Cancel
              </button>
              <button onClick={handleEditSave} className={styles.saveButton}>
                <Save size={16} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className={styles.modalOverlay} onClick={() => setDeleteConfirm(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Delete Image</h3>
              <button onClick={() => setDeleteConfirm(null)} className={styles.modalClose}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.deleteWarning}>
                Are you sure you want to delete this image? This action cannot be undone.
              </p>
            </div>
            <div className={styles.modalActions}>
              <button onClick={() => setDeleteConfirm(null)} className={styles.cancelButton}>
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} className={styles.deleteConfirmButton}>
                <Trash2 size={16} />
                Delete Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
