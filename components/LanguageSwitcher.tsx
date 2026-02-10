'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import styles from './LanguageSwitcher.module.css'

const languages = [
  { code: 'en', label: 'EN', fullName: 'English' },
  { code: 'ka', label: 'KA', fullName: 'ქართული' },
  { code: 'ru', label: 'RU', fullName: 'Русский' },
]

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const switchLocale = (newLocale: string) => {
    // Get the path segments
    const segments = pathname.split('/')
    const hasLocalePrefix = languages.some((lang) => lang.code === segments[1])

    let newPath: string
    if (hasLocalePrefix) {
      // Replace the current locale with the new one
      segments[1] = newLocale
      newPath = segments.join('/')
    } else {
      // Add the locale prefix
      newPath = `/${newLocale}${pathname}`
    }

    router.push(newPath)
    setIsOpen(false)
  }

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={styles.globe}>
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
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </span>
        <span className={styles.label}>{currentLanguage.label}</span>
        <span className={`${styles.chevron} ${isOpen ? styles.open : ''}`}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <ul className={styles.dropdown} role="listbox">
          {languages.map((lang) => (
            <li key={lang.code}>
              <button
                className={`${styles.option} ${lang.code === locale ? styles.active : ''}`}
                onClick={() => switchLocale(lang.code)}
                role="option"
                aria-selected={lang.code === locale}
              >
                <span className={styles.optionLabel}>{lang.label}</span>
                <span className={styles.optionName}>{lang.fullName}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
