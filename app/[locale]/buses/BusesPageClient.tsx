'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { BusCard } from '@/components/public'
import styles from './buses.module.css'

interface Bus {
  id: string
  name: string
  busClass: string
  capacity: number
  imageUrl: string
}

interface BusesPageClientProps {
  buses: Bus[]
}

type FilterType = 'all' | 'Standard' | 'Comfort' | 'VIP'

export default function BusesPageClient({ buses }: BusesPageClientProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const t = useTranslations('fleet')
  const tBuses = useTranslations('buses')
  const tNav = useTranslations('nav')

  const filters: { key: FilterType; labelKey: 'filterAll' | 'filterStandard' | 'filterComfort' | 'filterVip' }[] = [
    { key: 'all', labelKey: 'filterAll' },
    { key: 'Standard', labelKey: 'filterStandard' },
    { key: 'Comfort', labelKey: 'filterComfort' },
    { key: 'VIP', labelKey: 'filterVip' },
  ]

  const filteredBuses = activeFilter === 'all'
    ? buses
    : buses.filter((bus) => bus.busClass === activeFilter)

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{tNav('buses')}</h1>
          <p className={styles.heroSubtitle}>{t('tag')}</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.filters}>
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`${styles.filterButton} ${activeFilter === filter.key ? styles.filterButtonActive : ''}`}
              >
                {tBuses(filter.labelKey)}
              </button>
            ))}
          </div>

          <div className={styles.resultsInfo}>
            <span className={styles.resultsCount}>
              {filteredBuses.length} {filteredBuses.length === 1 ? tBuses('busSingular') : tBuses('busPlural')}
            </span>
          </div>

          <div className={styles.grid}>
            {filteredBuses.map((bus) => (
              <BusCard
                key={bus.id}
                id={bus.id}
                name={bus.name}
                busClass={bus.busClass}
                capacity={bus.capacity}
                imageUrl={bus.imageUrl}
              />
            ))}
          </div>

          {filteredBuses.length === 0 && (
            <div className={styles.noResults}>
              <p>{tBuses('noResults')}</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
