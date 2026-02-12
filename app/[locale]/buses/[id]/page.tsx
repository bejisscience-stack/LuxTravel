import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { Footer } from '@/components/public'
import BusDetailClient from './BusDetailClient'
import type { Bus, Locale } from '@/types/database'

type Props = {
  params: { locale: string; id: string }
}

export async function generateStaticParams() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return []
  }
  try {
    const supabase = createServiceClient()
    const { data } = await supabase
      .from('buses')
      .select('*')
      .eq('is_active', true)
    const buses = data as Bus[] | null
    if (!buses) return []
    return buses.map((bus) => ({ id: bus.id }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params: { locale, id } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta' })
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { title: t('title'), description: t('description') }
  }
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('buses')
      .select('*')
      .eq('id', id)
      .single()
    const bus = data as Bus | null
    if (!bus) return { title: 'Bus Not Found' }
    const descriptionKey = `description_${locale}` as keyof Bus
    const description = (bus[descriptionKey] as string) || bus.description_en || t('description')
    return {
      title: `${bus.name} | ${t('title')}`,
      description: description,
      openGraph: {
        title: `${bus.name} | ${t('title')}`,
        description: description,
        locale: locale,
        type: 'website',
        images: bus.photos?.[0] ? [{ url: bus.photos[0] }] : undefined,
      },
    }
  } catch {
    return { title: t('title'), description: t('description') }
  }
}

async function getBusData(id: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { bus: null, relatedBuses: [] as Bus[] }
  }
  try {
    const supabase = await createClient()
    const [busResult, relatedResult] = await Promise.all([
      supabase.from('buses').select('*').eq('id', id).single(),
      supabase
        .from('buses')
        .select('*')
        .eq('is_active', true)
        .neq('id', id)
        .limit(3),
    ])
    return {
      bus: busResult.data as Bus | null,
      relatedBuses: (relatedResult.data as Bus[]) || [],
    }
  } catch {
    return { bus: null, relatedBuses: [] as Bus[] }
  }
}

export default async function BusDetailPage({ params: { locale, id } }: Props) {
  const { bus, relatedBuses } = await getBusData(id)

  if (!bus) {
    notFound()
  }

  // Get localized description
  const descriptionKey = `description_${locale}` as keyof Bus
  const description = (bus[descriptionKey] as string) || bus.description_en || ''

  // Transform related buses
  const transformedRelatedBuses = relatedBuses.map((b) => ({
    id: b.id,
    name: b.name,
    busClass: b.class,
    capacity: b.capacity,
    imageUrl: b.photos?.[0] || 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2671&auto=format&fit=crop',
  }))

  return (
    <main>
      <BusDetailClient
        bus={{
          id: bus.id,
          name: bus.name,
          busClass: bus.class,
          capacity: bus.capacity,
          description: description,
          amenities: bus.amenities || [],
          photos: bus.photos || [],
        }}
        relatedBuses={transformedRelatedBuses}
        locale={locale as Locale}
      />
      <Footer />
    </main>
  )
}
