'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import ServiceCard from './ServiceCard'
import styles from './ServicesSection.module.css'

interface ServicePreview {
  name: string
  description: string
  imageUrl: string
}

interface ServicesSectionProps {
  services: ServicePreview[]
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  const t = useTranslations('services')
  const locale = useLocale()

  if (services.length === 0) return null

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.tag}>{t('tag')}</span>
        <h2 className={styles.title}>{t('title')}</h2>
        <div className={styles.divider}></div>
      </div>

      <div className={styles.grid}>
        {services.map((service, index) => (
          <ServiceCard
            key={index}
            name={service.name}
            description={service.description}
            imageUrl={service.imageUrl}
          />
        ))}
      </div>

      <div className={styles.viewAllWrapper}>
        <Link href={`/${locale}/services`} className={styles.viewAllLink}>
          {t('viewAll')}
          <svg
            width="16"
            height="16"
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
        </Link>
      </div>
    </section>
  )
}
