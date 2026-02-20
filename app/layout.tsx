import type { Metadata, Viewport } from 'next'
import { Montserrat, Cormorant_Garamond } from 'next/font/google'
import '@/styles/globals.css'

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['100', '200', '300', '400', '600'],
  variable: '--font-montserrat',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: 'LuxTravel | Executive Ground Travel, Redefined',
  description: 'Experience premium bus tours across Georgia. Luxury travel with world-class comfort, curated routes, and exceptional service.',
  keywords: ['luxury bus', 'premium travel', 'Georgia tours', 'executive transport', 'luxury bus tours'],
  authors: [{ name: 'LuxTravel' }],
  openGraph: {
    title: 'LuxTravel | Executive Ground Travel, Redefined',
    description: 'Experience premium bus tours across Georgia with world-class comfort.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${montserrat.variable} ${cormorant.variable}`}>
      <body>{children}</body>
    </html>
  )
}
