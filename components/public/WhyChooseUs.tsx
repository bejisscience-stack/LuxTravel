'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import styles from './WhyChooseUs.module.css'

interface Feature {
  key: string
  icon: React.ReactNode
}

interface WhyChooseUsProps {
  tag?: string
  title?: string
  description?: string
  imageUrl?: string
}

const WifiIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <line x1="12" y1="20" x2="12.01" y2="20" />
  </svg>
)

const AcIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 16a4 4 0 0 1-4-4 4 4 0 0 1 4-4" />
    <path d="M16 8a4 4 0 0 1 4 4 4 4 0 0 1-4 4" />
    <line x1="12" y1="2" x2="12" y2="22" />
    <path d="M12 6l-2-2" />
    <path d="M12 6l2-2" />
    <path d="M12 18l-2 2" />
    <path d="M12 18l2 2" />
  </svg>
)

const UsbIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="7" r="1" />
    <circle cx="4" cy="20" r="1" />
    <path d="M4.5 19.5L10.5 7.5" />
    <circle cx="20" cy="15" r="1" />
    <path d="M14 14l5.5 1" />
    <path d="M14 14l-3-3" />
    <line x1="12" y1="12" x2="12" y2="3" />
    <path d="M12 3l-2 2" />
    <path d="M12 3l2 2" />
  </svg>
)

const SeatIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 18v-5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v5" />
    <path d="M4 18h16" />
    <path d="M6 18v3" />
    <path d="M18 18v3" />
    <path d="M8 10V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4" />
  </svg>
)

const ToiletIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12" />
    <path d="M6 3v8a6 6 0 0 0 12 0V3" />
    <path d="M6 11h12" />
    <path d="M9 21h6" />
    <path d="M12 17v4" />
  </svg>
)

const EntertainmentIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="18" x2="12" y2="21" />
    <polygon points="10 9 15 12 10 15 10 9" />
  </svg>
)

const RefreshmentsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
    <line x1="6" y1="2" x2="6" y2="4" />
    <line x1="10" y1="2" x2="10" y2="4" />
    <line x1="14" y1="2" x2="14" y2="4" />
  </svg>
)

const defaultFeatures: Feature[] = [
  { key: 'wifi', icon: <WifiIcon /> },
  { key: 'ac', icon: <AcIcon /> },
  { key: 'usb', icon: <UsbIcon /> },
  { key: 'seats', icon: <SeatIcon /> },
  { key: 'toilet', icon: <ToiletIcon /> },
  { key: 'entertainment', icon: <EntertainmentIcon /> },
  { key: 'refreshments', icon: <RefreshmentsIcon /> },
]

export default function WhyChooseUs({
  tag,
  title,
  description,
  imageUrl = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2669&auto=format&fit=crop',
}: WhyChooseUsProps) {
  const [imageHovered, setImageHovered] = useState(false)
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null)
  const t = useTranslations('showcase')
  const tFeatures = useTranslations('features')

  const displayTag = tag || t('tag')
  const displayTitle = title || t('title')
  const displayDescription = description || t('description')

  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        <div className={styles.content}>
          <span className={styles.tag}>{displayTag}</span>
          <h2 className={styles.title}>
            {displayTitle.split(' ')[0]}<br />
            {displayTitle.split(' ').slice(1).join(' ')}
          </h2>
          <p className={styles.description}>{displayDescription}</p>

          <div className={styles.features}>
            {defaultFeatures.map((feature, index) => (
              <div
                key={feature.key}
                className={`${styles.feature} ${hoveredFeature === feature.key ? styles.featureHovered : ''}`}
                onMouseEnter={() => setHoveredFeature(feature.key)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className={styles.featureIcon}>{feature.icon}</div>
                <span className={styles.featureName}>{tFeatures(feature.key)}</span>
                <span className={styles.featureNumber}>
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className={styles.imageContainer}
          onMouseEnter={() => setImageHovered(true)}
          onMouseLeave={() => setImageHovered(false)}
        >
          <Image
            src={imageUrl}
            alt={displayTitle}
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            className={`${styles.image} ${imageHovered ? styles.imageHovered : ''}`}
          />
        </div>
      </div>
    </section>
  )
}
