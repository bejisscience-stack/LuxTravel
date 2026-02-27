import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { Hero, WhyChooseUs, FleetSection, ServicesSection, Gallery, ContactSection, Footer } from '@/components/public'
import type { Bus, Service, GalleryImage, SiteContent, Setting } from '@/types/database'

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta' })

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      locale: locale,
      type: 'website',
    },
  }
}

async function getHomePageData() {
  const empty = {
    buses: [] as Bus[],
    services: [] as Service[],
    gallery: [] as GalleryImage[],
    siteContent: [] as SiteContent[],
    settings: [] as Setting[],
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return empty
  }
  try {
    const supabase = await createClient()
    const [busesResult, servicesResult, galleryResult, siteContentResult, settingsResult] = await Promise.all([
      supabase
        .from('buses')
        .select('*')
        .eq('is_active', true)
        .order('class')
        .limit(6),
      supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('name')
        .limit(3),
      supabase
        .from('gallery')
        .select('*')
        .order('sort_order'),
      supabase
        .from('site_content')
        .select('*'),
      supabase
        .from('settings')
        .select('*'),
    ])
    return {
      buses: (busesResult.data as Bus[]) || [],
      services: (servicesResult.data as Service[]) || [],
      gallery: (galleryResult.data as GalleryImage[]) || [],
      siteContent: (siteContentResult.data as SiteContent[]) || [],
      settings: (settingsResult.data as Setting[]) || [],
    }
  } catch {
    return empty
  }
}

export default async function HomePage({ params: { locale } }: Props) {
  const { buses, services, gallery, siteContent, settings } = await getHomePageData()

  // Transform buses for FleetSection component
  const fleetBuses = buses.map((bus) => ({
    id: bus.id,
    name: bus.name,
    busClass: bus.class,
    capacity: bus.capacity,
    imageUrl: bus.photos?.[0] || 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2671&auto=format&fit=crop',
  }))

  // Get hero content from site_content
  const getContent = (key: string): SiteContent | undefined => {
    return siteContent.find((item) => item.key === key)
  }

  const heroTitle = getContent('hero_title')
  const heroSubtitle = getContent('hero_subtitle')
  const heroImage = getContent('hero_image')

  // Get localized value helper
  const getLocalizedValue = (content: SiteContent | undefined, locale: string): string | undefined => {
    if (!content) return undefined
    const key = `value_${locale}` as keyof SiteContent
    return (content[key] as string) || content.value_en || undefined
  }

  // Build settings map for easy access
  const settingsMap: Record<string, string> = {}
  settings.forEach((s) => {
    if (s.value) settingsMap[s.key] = s.value
  })

  // Build settings object for ContactSection and Footer
  const settingsData = {
    phone: settingsMap['company_phone'],
    email: settingsMap['company_email'],
    address: settingsMap['company_address'],
    whatsapp: settingsMap['company_whatsapp'],
    facebook: settingsMap['social_facebook'],
    instagram: settingsMap['social_instagram'],
    tiktok: settingsMap['social_tiktok'],
  }

  // Get WhyChooseUs content
  const whyTitle = getContent('why_choose_us_title')
  const whySubtitle = getContent('why_choose_us_subtitle')

  return (
    <main>
      <Hero
        title={getLocalizedValue(heroTitle, locale)}
        subtitle={getLocalizedValue(heroSubtitle, locale)}
        backgroundImage={heroImage?.image_url || undefined}
      />
      <WhyChooseUs
        title={getLocalizedValue(whyTitle, locale)}
        description={getLocalizedValue(whySubtitle, locale)}
      />
      <FleetSection buses={fleetBuses} />
      <ServicesSection
        services={services.map((s) => ({
          name: s.name,
          description: (s[`description_${locale}` as keyof Service] as string) || s.description_en || '',
          imageUrl: s.photos?.[0] || '',
        }))}
      />
      <Gallery images={gallery} />
      <ContactSection settings={settingsData} />
      <Footer settings={settingsData} />
    </main>
  )
}
