// Design System Colors
export const colors = {
  background: {
    primary: '#050505',
    secondary: '#000000',
    hover: '#0f0f0f',
  },
  text: {
    primary: '#F0F2F5',
    secondary: '#A0A0A0',
  },
  accent: {
    primary: '#B8182F',
  },
  border: {
    light: 'rgba(255,255,255,0.1)',
    medium: 'rgba(255,255,255,0.2)',
    strong: 'rgba(255,255,255,0.3)',
  },
} as const

// Language Options
export const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ka', name: 'Georgian', nativeName: 'ქართული' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
] as const

// Real Bus Features (as per Phase 1 requirements)
export const busFeatures = [
  { name: 'WiFi Connectivity', icon: '01' },
  { name: 'Air Conditioning', icon: '02' },
  { name: 'USB Charging Ports', icon: '03' },
  { name: 'Comfortable Seating', icon: '04' },
  { name: 'Onboard Toilet', icon: '05' },
  { name: 'Entertainment System', icon: '06' },
  { name: 'Refreshments Available', icon: '07' },
] as const

// Social Media Links
export const socialLinks = {
  facebook: 'https://facebook.com/luxtravel',
  instagram: 'https://instagram.com/luxtravel',
  tiktok: 'https://tiktok.com/@luxtravel',
} as const

// Contact Information
export const contactInfo = {
  email: 'info.happytrevel2021@gmail.com',
  phone: '+995 598 700 767',
  phone2: '+995 551 275 555',
  address: 'Tbilisi, Georgia',
} as const
