'use client'

import { useTranslations } from 'next-intl'
import { ServiceCard } from '@/components/public'
import styles from './services.module.css'

interface ServiceItem {
  name: string
  description: string
  imageUrl: string
}

interface ServicesPageClientProps {
  services: ServiceItem[]
}

export default function ServicesPageClient({ services }: ServicesPageClientProps) {
  const t = useTranslations('services')
  const tNav = useTranslations('nav')

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{tNav('services')}</h1>
          <p className={styles.heroSubtitle}>{t('tag')}</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {services.map((service, i) => (
              <ServiceCard
                key={i}
                name={service.name}
                description={service.description}
                imageUrl={service.imageUrl}
              />
            ))}
          </div>

          {services.length === 0 && (
            <div className={styles.noResults}>
              <p>{t('noResults')}</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
