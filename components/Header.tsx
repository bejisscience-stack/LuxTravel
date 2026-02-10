'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import styles from './Header.module.css'
import LanguageSwitcher from './LanguageSwitcher'

export default function Header() {
  const [activeNav, setActiveNav] = useState('')
  const t = useTranslations('nav')
  const locale = useLocale()

  const navItems = [
    { label: t('home'), href: `/${locale}` },
    { label: t('buses'), href: `/${locale}/buses` },
  ]

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        LUX<span className={styles.logoAccent}>TRAVEL</span>
        <span className={styles.logoSeparator}></span>
      </div>

      <nav>
        <ul className={styles.nav}>
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                onClick={() => setActiveNav(item.label)}
                className={styles.navLink}
              >
                {item.label}
                <span className={styles.navUnderline}></span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <LanguageSwitcher />
    </header>
  )
}
