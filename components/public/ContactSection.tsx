'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Phone, Mail, MapPin, MessageCircle, Facebook, Instagram } from 'lucide-react'
import { socialLinks, contactInfo } from '@/lib/constants'
import TikTokIcon from '@/components/icons/TikTokIcon'
import styles from './ContactSection.module.css'

interface SettingsData {
  phone?: string
  email?: string
  address?: string
  whatsapp?: string
  facebook?: string
  instagram?: string
  tiktok?: string
}

interface ContactSectionProps {
  settings?: SettingsData
}

interface FormData {
  name: string
  email: string
  message: string
}

export default function ContactSection({ settings }: ContactSectionProps) {
  const t = useTranslations('contact')
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      if (!supabaseUrl) {
        setSubmitStatus('error')
        return
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', message: '' })
      } else {
        setSubmitStatus('error')
      }
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const phone = settings?.phone || contactInfo.phone
  const phone2 = contactInfo.phone2
  const email = settings?.email || contactInfo.email
  const address = settings?.address || contactInfo.address
  const whatsappNumber = settings?.whatsapp || settings?.phone || contactInfo.phone

  const contactItems = [
    {
      icon: <Phone size={20} />,
      label: t('phone'),
      values: [
        { text: phone, href: `tel:${phone.replace(/\s/g, '')}` },
        { text: phone2, href: `tel:${phone2.replace(/\s/g, '')}` },
      ],
    },
    {
      icon: <Mail size={20} />,
      label: t('email'),
      values: [{ text: email, href: `mailto:${email}` }],
    },
    {
      icon: <MapPin size={20} />,
      label: t('address'),
      values: [{ text: address, href: null as string | null }],
    },
    {
      icon: <MessageCircle size={20} />,
      label: 'WhatsApp',
      values: [{ text: whatsappNumber, href: `https://wa.me/${whatsappNumber.replace(/[^\d+]/g, '')}` }],
    },
  ]

  const socialItems = [
    { icon: <Facebook size={20} />, href: settings?.facebook || socialLinks.facebook, label: 'Facebook' },
    { icon: <Instagram size={20} />, href: settings?.instagram || socialLinks.instagram, label: 'Instagram' },
    { icon: <TikTokIcon />, href: settings?.tiktok || socialLinks.tiktok, label: 'TikTok' },
  ]

  return (
    <section id="contact" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.tag}>{t('tag')}</span>
          <h2 className={styles.title}>{t('title')}</h2>
          <p className={styles.subtitle}>{t('subtitle')}</p>
        </div>

        <div className={styles.grid}>
          {/* Contact Info Column */}
          <div className={styles.infoColumn}>
            <div className={styles.contactItems}>
              {contactItems.map((item, index) => (
                <div key={index} className={styles.contactItem}>
                  <div className={styles.contactIcon}>{item.icon}</div>
                  <div className={styles.contactDetails}>
                    <span className={styles.contactLabel}>{item.label}</span>
                    {item.values.map((v, i) => (
                      v.href ? (
                        <a key={i} href={v.href} className={styles.contactValue} target={v.href.startsWith('https') ? '_blank' : undefined} rel={v.href.startsWith('https') ? 'noopener noreferrer' : undefined}>
                          {v.text}
                        </a>
                      ) : (
                        <span key={i} className={styles.contactValue}>{v.text}</span>
                      )
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.socialSection}>
              <span className={styles.socialLabel}>{t('followUs')}</span>
              <div className={styles.socials}>
                {socialItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    aria-label={item.label}
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className={styles.formColumn}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>{t('nameLabel')}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('namePlaceholder')}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>{t('emailLabel')}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('emailPlaceholder')}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.label}>{t('messageLabel')}</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t('messagePlaceholder')}
                  required
                  rows={5}
                  className={styles.textarea}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? t('sending') : t('sendMessage')}
              </button>

              {submitStatus === 'success' && (
                <p className={styles.successMessage}>{t('successMessage')}</p>
              )}
              {submitStatus === 'error' && (
                <p className={styles.errorMessage}>{t('errorMessage')}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
