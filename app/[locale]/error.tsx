'use client'

import { useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'
import styles from './error.module.css'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  const t = useTranslations('error')
  const locale = useLocale()

  useEffect(() => {
    // Log error to console in development
    console.error('Page error:', error)
  }, [error])

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Error Icon */}
        <div className={styles.iconContainer}>
          <AlertTriangle size={48} strokeWidth={1} />
        </div>

        {/* Error Message */}
        <div className={styles.textContent}>
          <h1 className={styles.title}>{t('title')}</h1>
          <p className={styles.description}>{t('description')}</p>
          {error.digest && (
            <p className={styles.errorCode}>
              Error ID: {error.digest}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <button onClick={reset} className={styles.primaryButton}>
            <RefreshCw size={18} />
            <span>{t('tryAgain')}</span>
          </button>
          <Link href={`/${locale}`} className={styles.secondaryButton}>
            <Home size={18} />
            <span>{t('backHome')}</span>
          </Link>
        </div>

        {/* Decorative Element */}
        <div className={styles.divider}></div>

        {/* Support Info */}
        <p className={styles.supportText}>
          {t('persistentError')}{' '}
          <a href="mailto:info@luxtravel.ge" className={styles.supportLink}>
            info@luxtravel.ge
          </a>
        </p>
      </div>
    </div>
  )
}
