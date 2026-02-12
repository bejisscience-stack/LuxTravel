import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { Footer } from '@/components/public'
import BusesPageClient from './BusesPageClient'
import type { Bus } from '@/types/database'

type Props = {
  params: { locale: string }
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta' })
  const tBuses = await getTranslations({ locale, namespace: 'buses' })

  return {
    title: `${tBuses('metaTitle')} | ${t('title')}`,
    description: t('description'),
    openGraph: {
      title: `${tBuses('metaTitle')} | ${t('title')}`,
      description: t('description'),
      locale: locale,
      type: 'website',
    },
  }
}

async function getBuses(): Promise<Bus[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return []
  }
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('buses')
      .select('*')
      .eq('is_active', true)
      .order('class')
      .order('name')
    if (error) {
      console.error('Error fetching buses:', error)
      return []
    }
    return (data as Bus[]) || []
  } catch {
    return []
  }
}

export default async function BusesPage({ params: { locale } }: Props) {
  const buses = await getBuses()

  // Transform buses for client component
  const transformedBuses = buses.map((bus) => ({
    id: bus.id,
    name: bus.name,
    busClass: bus.class,
    capacity: bus.capacity,
    imageUrl: bus.photos?.[0] || 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2671&auto=format&fit=crop',
  }))

  return (
    <main>
      <BusesPageClient buses={transformedBuses} />
      <Footer />
    </main>
  )
}
