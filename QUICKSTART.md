# 🚀 LuxTravel - Quick Start Guide

## Start Development in 3 Steps

### 1. Start the Development Server
```bash
npm run dev
```
If port 3000 is already in use, run this instead (it frees the port and starts):
```bash
npm run dev:now
```

### 2. Open Your Browser
As soon as you see **"✓ Ready"** in the terminal, open: **http://localhost:3000**  
You’ll be redirected to **http://localhost:3000/en** and can view the site. No Supabase setup required to view content.

### 3. Start Coding!
Edit `app/page.tsx` to see live updates.

---

## 📁 Where to Put Things

### Components
```
components/YourComponent.tsx
components/YourComponent.module.css
```

### Pages
```
app/your-page/page.tsx
```

### Styles
```
styles/your-styles.css
```

### Images
```
public/images/your-image.jpg
```

### Translations
```
messages/en.json
messages/ka.json
messages/ru.json
```

---

## 🎨 Quick Code Examples

### Create a New Component
```tsx
// components/MyComponent.tsx
import styles from './MyComponent.module.css'

export default function MyComponent() {
  return (
    <div className={styles.container}>
      <h2>My Component</h2>
    </div>
  )
}
```

### Use Translations
```tsx
import { useTranslations } from 'next-intl'

export default function MyComponent() {
  const t = useTranslations('nav')
  return <h1>{t('home')}</h1>
}
```

### Use Icons
```tsx
import { Wifi, Airplay, Usb } from 'lucide-react'

export default function Features() {
  return (
    <div>
      <Wifi size={24} color="#B8182F" />
      <Airplay size={24} />
      <Usb size={24} />
    </div>
  )
}
```

### Add Animation
```tsx
'use client'
import { motion } from 'framer-motion'

export default function Animated() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      Animated Content
    </motion.div>
  )
}
```

---

## 🎯 What to Build First

Reference: `ORIGINAL_REACT_CODE_REFERENCE.md`

### 1. Hero Section ⭐ START HERE
Create `components/Hero.tsx` based on the React code:
- Full-height section
- Background image from Unsplash
- Centered title: "The Art of Arrival"
- Subtitle: "Executive ground travel, redefined."
- **"Contact Us" button** (NOT BookingBar)

### 2. Feature List
Create `components/FeatureList.tsx`:
- WiFi Connectivity
- Air Conditioning
- USB Charging Ports
- Comfortable Seating
- Onboard Toilet
- Entertainment System
- Refreshments Available

### 3. Showcase Section
Create `components/Showcase.tsx`:
- Split layout (text + image)
- Hover effects on image

### 4. Fleet Section
Create `components/Fleet.tsx`:
- Grid of bus cards
- Hover animations

---

## 🌈 Design Tokens

### Colors (Copy & Paste)
```css
background: #050505;        /* Primary */
background: #000000;        /* Secondary */
color: #F0F2F5;            /* Text Primary */
color: #A0A0A0;            /* Text Secondary */
color: #B8182F;            /* Accent */
border: rgba(255,255,255,0.1);  /* Border */
```

### Fonts (Copy & Paste)
```css
font-family: var(--font-montserrat);  /* Headings */
font-family: var(--font-cormorant);   /* Body */
```

---

## 🔥 Hot Tips

1. **Live Reload**: Changes auto-refresh in browser
2. **CSS Modules**: Scoped styles, no conflicts
3. **TypeScript**: Get autocomplete everywhere
4. **i18n**: All text from translation files
5. **Image Optimization**: Use Next.js `<Image>` component

---

## 📖 Full Documentation

See `SETUP_COMPLETE.md` for complete details.

---

**Happy Coding! 🎉**
