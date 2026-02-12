'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Image from 'next/image'
import styles from './Gallery.module.css'

interface GalleryImage {
  id: string
  image_url: string
  alt_text_en: string | null
  alt_text_ka: string | null
  alt_text_ru: string | null
  sort_order: number
}

interface GalleryProps {
  images: GalleryImage[]
}

export default function Gallery({ images }: GalleryProps) {
  const t = useTranslations('gallery')
  const locale = useLocale()
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const lightboxRef = useCallback((node: HTMLDivElement | null) => {
    if (node) node.focus()
  }, [])

  const getAltText = (image: GalleryImage): string => {
    const altKey = `alt_text_${locale}` as keyof GalleryImage
    return (image[altKey] as string | null) || image.alt_text_en || ''
  }

  const openLightbox = (index: number) => {
    setSelectedIndex(index)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null)
    document.body.style.overflow = ''
  }, [])

  const goToPrevious = useCallback(() => {
    if (selectedIndex === null) return
    setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1)
  }, [selectedIndex, images.length])

  const goToNext = useCallback(() => {
    if (selectedIndex === null) return
    setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1)
  }, [selectedIndex, images.length])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return

      switch (e.key) {
        case 'Escape':
          closeLightbox()
          break
        case 'ArrowLeft':
          goToPrevious()
          break
        case 'ArrowRight':
          goToNext()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex, closeLightbox, goToPrevious, goToNext])

  // Swipe gesture support for lightbox
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return

    const deltaX = e.changedTouches[0].clientX - touchStartX.current
    const deltaY = e.changedTouches[0].clientY - touchStartY.current

    // Only trigger if horizontal swipe is dominant
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        goToPrevious()
      } else {
        goToNext()
      }
    }

    touchStartX.current = null
    touchStartY.current = null
  }, [goToPrevious, goToNext])

  if (!images || images.length === 0) {
    return null
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.tag}>{t('tag')}</span>
        <h2 className={styles.title}>{t('title')}</h2>
        <div className={styles.divider}></div>
      </div>

      <div className={styles.grid}>
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`${styles.imageWrapper} ${hoveredId === image.id ? styles.imageWrapperHovered : ''}`}
            onMouseEnter={() => setHoveredId(image.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => openLightbox(index)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(index) } }}
            role="button"
            tabIndex={0}
            aria-label={`View ${getAltText(image)}`}
          >
            <Image
              src={image.image_url}
              alt={getAltText(image)}
              fill
              sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className={`${styles.image} ${hoveredId === image.id ? styles.imageHovered : ''}`}
            />
            <div className={`${styles.overlay} ${hoveredId === image.id ? styles.overlayHovered : ''}`}>
              <span className={styles.zoomIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.35-4.35" />
                  <path d="M11 8v6M8 11h6" />
                </svg>
              </span>
            </div>
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <div
          className={styles.lightbox}
          onClick={closeLightbox}
          ref={lightboxRef}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
          tabIndex={-1}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onKeyDown={(e) => {
            if (e.key === 'Tab') {
              const focusable = e.currentTarget.querySelectorAll<HTMLElement>('button')
              const first = focusable[0]
              const last = focusable[focusable.length - 1]
              if (e.shiftKey) {
                if (document.activeElement === first) { e.preventDefault(); last.focus() }
              } else {
                if (document.activeElement === last) { e.preventDefault(); first.focus() }
              }
            }
          }}
        >
          <button className={styles.closeButton} onClick={closeLightbox} aria-label="Close">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <button
            className={`${styles.navButton} ${styles.prevButton}`}
            onClick={(e) => {
              e.stopPropagation()
              goToPrevious()
            }}
            aria-label="Previous image"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[selectedIndex].image_url}
              alt={getAltText(images[selectedIndex])}
              fill
              sizes="100vw"
              className={styles.lightboxImage}
              priority
            />
          </div>

          <button
            className={`${styles.navButton} ${styles.nextButton}`}
            onClick={(e) => {
              e.stopPropagation()
              goToNext()
            }}
            aria-label="Next image"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          <div className={styles.counter}>
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </section>
  )
}
