import { getRequestConfig } from 'next-intl/server'

// Supported locales
export const locales = ['en', 'ka', 'ru'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

// Language display names
export const localeNames: Record<Locale, string> = {
  en: 'English',
  ka: 'ქართული',
  ru: 'Русский',
}

export default getRequestConfig(async ({ requestLocale }) => {
  // Get the locale from the request, default to 'en' if not available
  let locale = await requestLocale
  
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
