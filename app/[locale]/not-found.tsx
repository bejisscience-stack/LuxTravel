import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Home, ArrowLeft, Search } from 'lucide-react'
import styles from './not-found.module.css'

export default function NotFound() {
  const t = useTranslations('notFound')

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* 404 Display */}
        <div className={styles.errorDisplay}>
          <span className={styles.errorNumber}>404</span>
          <div className={styles.errorLine}></div>
        </div>

        {/* Message */}
        <div className={styles.textContent}>
          <h1 className={styles.title}>{t('title')}</h1>
          <p className={styles.description}>{t('description')}</p>
        </div>

        {/* Navigation Options */}
        <div className={styles.navigation}>
          <Link href="/" className={styles.primaryButton}>
            <Home size={18} />
            <span>{t('backHome')}</span>
          </Link>
          <Link href="/buses" className={styles.secondaryButton}>
            <Search size={18} />
            <span>{t('viewFleet')}</span>
          </Link>
        </div>

        {/* Helpful Links */}
        <div className={styles.helpfulLinks}>
          <span className={styles.helpfulTitle}>{t('helpfulLinks')}</span>
          <div className={styles.links}>
            <Link href="/#fleet" className={styles.link}>
              <ArrowLeft size={14} />
              <span>{t('ourFleet')}</span>
            </Link>
            <Link href="/#contact" className={styles.link}>
              <ArrowLeft size={14} />
              <span>{t('contactUs')}</span>
            </Link>
            <Link href="/#about" className={styles.link}>
              <ArrowLeft size={14} />
              <span>{t('aboutUs')}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className={styles.bgDecoration}></div>
    </div>
  )
}
