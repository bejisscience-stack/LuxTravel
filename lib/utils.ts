import { type ClassValue, clsx } from 'clsx'

// Utility function for conditional classNames (useful for styling)
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// Format phone number
export function formatPhoneNumber(phone: string): string {
  return phone.replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, '+$1 $2 $3 $4')
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Debounce function for search/input handlers
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

// Get locale display name
export function getLocaleDisplayName(locale: string): string {
  const localeMap: Record<string, string> = {
    en: 'EN',
    ka: 'KA',
    ru: 'RU',
  }
  return localeMap[locale] || locale.toUpperCase()
}
