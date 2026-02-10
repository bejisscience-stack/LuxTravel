import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://luxtravel.ge'
const locales = ['en', 'ka', 'ru']

async function getBusIds(): Promise<string[]> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return []
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    
    const { data, error } = await supabase
      .from('buses')
      .select('id, updated_at')
      .eq('is_active', true)

    if (error) {
      console.error('Sitemap: Error fetching buses:', error)
      return []
    }

    return data?.map(bus => bus.id) || []
  } catch (error) {
    console.error('Sitemap: Error:', error)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const busIds = await getBusIds()
  const currentDate = new Date()

  // Static pages with all locales
  const staticPages = [
    {
      url: '',
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: '/buses',
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ]

  // Generate sitemap entries for static pages across all locales
  const staticEntries: MetadataRoute.Sitemap = staticPages.flatMap(page =>
    locales.map(locale => ({
      url: `${baseUrl}/${locale}${page.url}`,
      lastModified: currentDate,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    }))
  )

  // Generate sitemap entries for dynamic bus pages across all locales
  const busEntries: MetadataRoute.Sitemap = busIds.flatMap(busId =>
    locales.map(locale => ({
      url: `${baseUrl}/${locale}/buses/${busId}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  )

  // Add root URL redirect entries
  const rootEntry: MetadataRoute.Sitemap = [{
    url: baseUrl,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 1.0,
  }]

  return [...rootEntry, ...staticEntries, ...busEntries]
}
