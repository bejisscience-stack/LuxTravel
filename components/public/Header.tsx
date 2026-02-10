'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import LanguageSwitcher from '../LanguageSwitcher'
import styles from './Header.module.css'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const t = useTranslations('nav')
  const locale = useLocale()

  const navItems = [
    { label: t('home'), href: `/${locale}` },
    { label: t('buses'), href: `/${locale}/buses` },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <Link href={`/${locale}`} className={styles.logo}>
        LUX<span className={styles.logoAccent}>TRAVEL</span>
        <span className={styles.logoSeparator}></span>
      </Link>

      {/* Desktop Navigation */}
      <nav className={styles.desktopNav}>
        <ul className={styles.nav}>
          {navItems.map((item, index) => (
            <li key={index}>
              <Link href={item.href} className={styles.navLink}>
                {item.label}
                <span className={styles.navUnderline}></span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.desktopSwitcher}>
        <LanguageSwitcher />
      </div>

      {/* Hamburger Button */}
      <button
        className={`${styles.hamburger} ${isMenuOpen ? styles.open : ''}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
        aria-expanded={isMenuOpen}
      >
        <span className={styles.hamburgerLine}></span>
        <span className={styles.hamburgerLine}></span>
        <span className={styles.hamburgerLine}></span>
      </button>

      {/* Mobile Menu Overlay */}
      <div className={`${styles.mobileMenuOverlay} ${isMenuOpen ? styles.open : ''}`}>
        <nav className={styles.mobileNav}>
          <ul className={styles.mobileNavList}>
            {navItems.map((item, index) => (
              <li key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                <Link
                  href={item.href}
                  className={styles.mobileNavLink}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className={styles.mobileSwitcher}>
            <LanguageSwitcher />
          </div>
        </nav>
      </div>
    </header>
  )
}
