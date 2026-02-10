import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { socialLinks } from '@/lib/constants'
import styles from './Footer.module.css'

export default function Footer() {
  const t = useTranslations('footer')

  const links = [
    { label: t('home'), href: '/' },
    { label: t('buses'), href: '/buses' },
    { label: t('facebook'), href: socialLinks.facebook, external: true },
    { label: t('instagram'), href: socialLinks.instagram, external: true },
    { label: t('tiktok'), href: socialLinks.tiktok, external: true },
    { label: t('contact'), href: '/contact' },
  ]

  return (
    <footer className={styles.footer}>
      <div className={styles.logo}>
        LUX<br />TRAVEL
      </div>

      <div className={styles.links}>
        {links.map((link, index) => (
          link.external ? (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              {link.label}
            </a>
          ) : (
            <Link
              key={index}
              href={link.href}
              className={styles.link}
            >
              {link.label}
            </Link>
          )
        ))}
      </div>
    </footer>
  )
}
