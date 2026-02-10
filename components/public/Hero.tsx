'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import styles from './Hero.module.css'

interface HeroProps {
  title?: string
  subtitle?: string
  backgroundImage?: string
}

export default function Hero({
  title,
  subtitle,
  backgroundImage = 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2671&auto=format&fit=crop',
}: HeroProps) {
  const [hovered, setHovered] = useState(false)
  const t = useTranslations('hero')

  const displayTitle = title || t('title')
  const displaySubtitle = subtitle || t('subtitle')

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      className={styles.hero}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={`${styles.background} ${hovered ? styles.hovered : ''}`}
        style={{ backgroundImage: `url("${backgroundImage}")` }}
      ></div>
      <div className={styles.glassOverlay}></div>

      <div className={styles.content}>
        <div className={styles.lineTop}></div>
        <div className={styles.lineBottom}></div>

        <h1 className={styles.title}>
          {displayTitle.split(' ').slice(0, -1).join(' ')}<br />
          {displayTitle.split(' ').slice(-1)}
        </h1>
        <p className={styles.subtitle}>{displaySubtitle}</p>

        <button
          className={styles.ctaButton}
          onClick={scrollToContact}
          aria-label={t('cta')}
        >
          <span className={styles.ctaText}>{t('cta')}</span>
          <span className={styles.ctaArrow}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        </button>
      </div>
    </section>
  )
}
