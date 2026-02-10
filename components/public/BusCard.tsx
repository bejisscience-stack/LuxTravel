'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import styles from './BusCard.module.css'

interface BusCardProps {
  id: string
  name: string
  busClass: string
  capacity: number
  imageUrl: string
}

export default function BusCard({
  id,
  name,
  busClass,
  capacity,
  imageUrl,
}: BusCardProps) {
  const [hovered, setHovered] = useState(false)
  const t = useTranslations('fleet')
  const locale = useLocale()

  return (
    <Link href={`/${locale}/buses/${id}`} className={styles.cardLink}>
      <article
        className={`${styles.card} ${hovered ? styles.hovered : ''}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className={styles.header}>
          <h3 className={styles.name}>{name}</h3>
          <p className={styles.class}>{busClass}</p>
        </div>

        <div className={styles.imageContainer}>
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`${styles.image} ${hovered ? styles.imageHovered : ''}`}
          />
        </div>

        <div className={styles.footer}>
          <span className={styles.capacity}>
            {capacity} {t('passengers')}
          </span>
          <span className={styles.viewDetails}>
            {t('viewDetails')}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.arrow}
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        </div>
      </article>
    </Link>
  )
}
