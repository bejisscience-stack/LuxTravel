'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { socialLinks, contactInfo } from '@/lib/constants'
import TikTokIcon from '@/components/icons/TikTokIcon'
import styles from './Footer.module.css'

interface SettingsData {
  phone?: string
  email?: string
  address?: string
  whatsapp?: string
  facebook?: string
  instagram?: string
  tiktok?: string
}

interface FooterProps {
  settings?: SettingsData
}

export default function Footer({ settings }: FooterProps) {
  const t = useTranslations('footer')
  const tContact = useTranslations('contact')
  const locale = useLocale()
  const currentYear = new Date().getFullYear()

  const navLinks = [
    { label: t('home'), href: `/${locale}` },
    { label: t('buses'), href: `/${locale}/buses` },
  ]

  const phone = contactInfo.phone
  const phone2 = contactInfo.phone2
  const email = contactInfo.email
  const address = settings?.address || contactInfo.address

  const socialLinkItems = [
    { label: t('facebook'), href: settings?.facebook || socialLinks.facebook, icon: <FacebookIcon /> },
    { label: t('instagram'), href: settings?.instagram || socialLinks.instagram, icon: <InstagramIcon /> },
    { label: t('tiktok'), href: settings?.tiktok || socialLinks.tiktok, icon: <TikTokIcon /> },
  ]

  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.container}>
        {/* Top Row: Logo and Navigation */}
        <div className={styles.topRow}>
          <Link href={`/${locale}`} className={styles.logo}>
            LUX<span className={styles.logoAccent}>TRAVEL</span>
          </Link>

          <nav className={styles.nav}>
            {navLinks.map((link, index) => (
              <Link key={index} href={link.href} className={styles.navLink}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className={styles.socials}>
            {socialLinkItems.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Middle Row: Contact Info */}
        <div className={styles.contactRow}>
          <div className={styles.contactItem}>
            <span className={styles.contactLabel}>{tContact('email')}</span>
            <a href={`mailto:${email}`} className={styles.contactValue}>
              {email}
            </a>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.contactLabel}>{tContact('phone')}</span>
            <a href={`tel:${phone.replace(/\s/g, '')}`} className={styles.contactValue}>
              {phone}
            </a>
            <a href={`tel:${phone2.replace(/\s/g, '')}`} className={styles.contactValue}>
              {phone2}
            </a>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.contactLabel}>{tContact('address')}</span>
            <span className={styles.contactValue}>{address}</span>
          </div>
        </div>

        {/* Bottom Row: Copyright */}
        <div className={styles.bottomRow}>
          <p className={styles.copyright}>
            © {currentYear} LuxTravel. {t('copyright')}
          </p>
        </div>
      </div>
    </footer>
  )
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

