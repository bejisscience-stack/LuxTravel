import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { Footer } from '@/components/public'
import ServicesPageClient from './ServicesPageClient'
import type { Service } from '@/types/database'

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta' })
  const tServices = await getTranslations({ locale, namespace: 'services' })

  return {
    title: `${tServices('metaTitle')} | ${t('title')}`,
    description: t('description'),
    openGraph: {
      title: `${tServices('metaTitle')} | ${t('title')}`,
      description: t('description'),
      locale: locale,
      type: 'website',
    },
  }
}

async function getServices(locale: string): Promise<{ name: string; description: string; imageUrl: string }[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return []
  }
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (error) {
      console.error('Error fetching services:', error)
      return []
    }

    return ((data as Service[]) || []).map((s) => ({
      name: s.name,
      description: (s[`description_${locale}` as keyof Service] as string) || s.description_en || '',
      imageUrl: s.photos?.[0] || '',
    }))
  } catch {
    return []
  }
}

export default async function ServicesPage({ params: { locale } }: Props) {
  const services = await getServices(locale)

  return (
    <main>
      <ServicesPageClient services={services} />
      <Footer />
    </main>
  )
}
