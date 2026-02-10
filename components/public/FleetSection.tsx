'use client'

import { useTranslations } from 'next-intl'
import BusCard from './BusCard'
import styles from './FleetSection.module.css'

interface Bus {
  id: string
  name: string
  busClass: string
  capacity: number
  imageUrl: string
}

interface FleetSectionProps {
  buses: Bus[]
}

export default function FleetSection({ buses }: FleetSectionProps) {
  const t = useTranslations('fleet')

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.tag}>{t('tag')}</span>
        <h2 className={styles.title}>{t('title')}</h2>
        <div className={styles.divider}></div>
      </div>

      <div className={styles.grid}>
        {buses.map((bus) => (
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
    </section>
  )
}
