'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Users, ArrowLeft, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { BusCard } from '@/components/public'
import type { Locale, BusAmenity } from '@/types/database'
import styles from './busDetail.module.css'

interface BusDetail {
  id: string
  name: string
  busClass: string
  capacity: number
  description: string
  amenities: BusAmenity[]
  photos: string[]
}

interface RelatedBus {
  id: string
  name: string
  busClass: string
  capacity: number
  imageUrl: string
}

interface BusDetailClientProps {
  bus: BusDetail
  relatedBuses: RelatedBus[]
  locale: Locale
}

const amenityLabels: Record<BusAmenity, string> = {
  wifi: 'WiFi',
  air_conditioning: 'Air Conditioning',
  leather_seats: 'Leather Seats',
  usb_charging: 'USB Charging',
  entertainment_system: 'Entertainment System',
  toilet: 'Onboard Toilet',
  minibar: 'Minibar',
  reclining_seats: 'Reclining Seats',
  panoramic_windows: 'Panoramic Windows',
  reading_lights: 'Reading Lights',
}

const amenityIcons: Record<BusAmenity, React.ReactNode> = {
  wifi: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <line x1="12" y1="20" x2="12.01" y2="20" />
    </svg>
  ),
  air_conditioning: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 16a4 4 0 0 1-4-4 4 4 0 0 1 4-4" />
      <path d="M16 8a4 4 0 0 1 4 4 4 4 0 0 1-4 4" />
      <line x1="12" y1="2" x2="12" y2="22" />
    </svg>
  ),
  leather_seats: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 18v-5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v5" />
      <path d="M4 18h16" />
      <path d="M6 18v3" />
      <path d="M18 18v3" />
    </svg>
  ),
  usb_charging: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="10" cy="7" r="1" />
      <circle cx="4" cy="20" r="1" />
      <path d="M4.5 19.5L10.5 7.5" />
      <line x1="12" y1="12" x2="12" y2="3" />
    </svg>
  ),
  entertainment_system: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="4" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="18" x2="12" y2="21" />
    </svg>
  ),
  toilet: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 3h12" />
      <path d="M6 3v8a6 6 0 0 0 12 0V3" />
      <path d="M6 11h12" />
      <path d="M12 17v4" />
    </svg>
  ),
  minibar: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
    </svg>
  ),
  reclining_seats: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 18v-5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v5" />
      <path d="M8 10V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4" />
    </svg>
  ),
  panoramic_windows: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <line x1="3" y1="12" x2="21" y2="12" />
    </svg>
  ),
  reading_lights: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2v6" />
      <path d="M12 8a4 4 0 0 0 4-4" />
      <path d="M12 8a4 4 0 0 1-4-4" />
    </svg>
  ),
}

export default function BusDetailClient({ bus, relatedBuses, locale }: BusDetailClientProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const t = useTranslations('fleet')
  const tContact = useTranslations('contact')
  const tCommon = useTranslations('common')

  const photos = bus.photos.length > 0
    ? bus.photos
    : ['https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2671&auto=format&fit=crop']

  const openLightbox = (index: number) => {
    setSelectedPhotoIndex(index)
    setLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
    document.body.style.overflow = ''
  }, [])

  const goToPrevious = useCallback(() => {
    setSelectedPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))
  }, [photos.length])

  const goToNext = useCallback(() => {
    setSelectedPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))
  }, [photos.length])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return

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
  }, [lightboxOpen, closeLightbox, goToPrevious, goToNext])

  const scrollToContact = () => {
    window.location.href = `/${locale}#contact`
  }

  return (
    <>
      {/* Hero with Main Image */}
      <section className={styles.hero}>
        <div className={styles.heroImage}>
          <Image
            src={photos[selectedPhotoIndex]}
            alt={bus.name}
            fill
            priority
            sizes="100vw"
            className={styles.mainImage}
          />
        </div>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <Link href={`/${locale}/buses`} className={styles.backLink}>
            <ArrowLeft size={20} />
            <span>{tCommon('back')}</span>
          </Link>
          <div className={styles.heroInfo}>
            <span className={styles.busClass}>{bus.busClass}</span>
            <h1 className={styles.busName}>{bus.name}</h1>
            <div className={styles.busCapacity}>
              <Users size={20} />
              <span>{bus.capacity} {t('passengers')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      {photos.length > 1 && (
        <section className={styles.gallerySection}>
          <div className={styles.container}>
            <div className={styles.galleryGrid}>
              {photos.map((photo, index) => (
                <button
                  key={index}
                  className={`${styles.galleryThumb} ${selectedPhotoIndex === index ? styles.galleryThumbActive : ''}`}
                  onClick={() => openLightbox(index)}
                >
                  <Image
                    src={photo}
                    alt={`${bus.name} - Photo ${index + 1}`}
                    fill
                    sizes="150px"
                    className={styles.thumbImage}
                  />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Content Section */}
      <section className={styles.contentSection}>
        <div className={styles.container}>
          <div className={styles.contentGrid}>
            {/* Description */}
            <div className={styles.descriptionColumn}>
              <h2 className={styles.sectionTitle}>About This Bus</h2>
              <p className={styles.description}>{bus.description || 'Experience luxury travel at its finest with our premium bus service.'}</p>

              <button className={styles.ctaButton} onClick={scrollToContact}>
                <span>{tContact('tag')}</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>

            {/* Specifications */}
            <div className={styles.specsColumn}>
              <h2 className={styles.sectionTitle}>Specifications</h2>
              <div className={styles.specsList}>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Class</span>
                  <span className={styles.specValue}>{bus.busClass}</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>{t('capacity')}</span>
                  <span className={styles.specValue}>{bus.capacity} {t('passengers')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          {bus.amenities.length > 0 && (
            <div className={styles.amenitiesSection}>
              <h2 className={styles.sectionTitle}>Amenities</h2>
              <div className={styles.amenitiesGrid}>
                {bus.amenities.map((amenity) => (
                  <div key={amenity} className={styles.amenityItem}>
                    <div className={styles.amenityIcon}>
                      {amenityIcons[amenity]}
                    </div>
                    <span className={styles.amenityLabel}>{amenityLabels[amenity]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Buses */}
      {relatedBuses.length > 0 && (
        <section className={styles.relatedSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Other Buses</h2>
            <div className={styles.relatedGrid}>
              {relatedBuses.map((relatedBus) => (
                <BusCard
                  key={relatedBus.id}
                  id={relatedBus.id}
                  name={relatedBus.name}
                  busClass={relatedBus.busClass}
                  capacity={relatedBus.capacity}
                  imageUrl={relatedBus.imageUrl}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <button className={styles.lightboxClose} onClick={closeLightbox} aria-label="Close">
            <X size={32} />
          </button>

          <button
            className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
            onClick={(e) => {
              e.stopPropagation()
              goToPrevious()
            }}
            aria-label="Previous image"
          >
            <ChevronLeft size={40} />
          </button>

          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <Image
              src={photos[selectedPhotoIndex]}
              alt={`${bus.name} - Photo ${selectedPhotoIndex + 1}`}
              fill
              sizes="100vw"
              className={styles.lightboxImage}
              priority
            />
          </div>

          <button
            className={`${styles.lightboxNav} ${styles.lightboxNext}`}
            onClick={(e) => {
              e.stopPropagation()
              goToNext()
            }}
            aria-label="Next image"
          >
            <ChevronRight size={40} />
          </button>

          <div className={styles.lightboxCounter}>
            {selectedPhotoIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  )
}
