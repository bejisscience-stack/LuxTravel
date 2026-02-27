import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

async function isAuthenticated(): Promise<boolean> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) return false

  const cookieStore = await cookies()
  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {},
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()
  return !!user
}

const SEED_SERVICES = [
  {
    name: 'Engine Diagnostics',
    description_en: 'Comprehensive engine diagnostics using state-of-the-art equipment. Our certified technicians identify and resolve issues quickly, ensuring your fleet stays on the road.',
    description_ka: 'ძრავის სრულყოფილი დიაგნოსტიკა თანამედროვე აღჭურვილობით. ჩვენი სერტიფიცირებული ტექნიკოსები სწრაფად ადგენენ და აგვარებენ პრობლემებს.',
    description_ru: 'Комплексная диагностика двигателя с использованием современного оборудования. Наши сертифицированные техники быстро выявляют и устраняют неисправности.',
    photos: [
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=2074&auto=format&fit=crop',
    ],
    is_active: true,
  },
  {
    name: 'Brake System Service',
    description_en: 'Professional brake inspection, repair, and replacement services. We ensure maximum safety for your passengers with thorough brake system maintenance.',
    description_ka: 'პროფესიონალური სამუხრუჭე სისტემის შემოწმება, შეკეთება და გამოცვლა. ჩვენ უზრუნველვყოფთ მაქსიმალურ უსაფრთხოებას თქვენი მგზავრებისთვის.',
    description_ru: 'Профессиональная проверка, ремонт и замена тормозной системы. Мы обеспечиваем максимальную безопасность ваших пассажиров.',
    photos: [
      'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2072&auto=format&fit=crop',
    ],
    is_active: true,
  },
  {
    name: 'AC System Maintenance',
    description_en: 'Complete air conditioning system service including refrigerant recharge, leak detection, and component repair to keep your passengers comfortable year-round.',
    description_ka: 'კონდიციონერის სრული მომსახურება, მათ შორის გაგრილების სითხის შევსება, გაჟონვის აღმოჩენა და კომპონენტების შეკეთება.',
    description_ru: 'Полное обслуживание системы кондиционирования, включая заправку хладагентом, обнаружение утечек и ремонт компонентов.',
    photos: [
      'https://images.unsplash.com/photo-1580894894513-541e068a3e2b?q=80&w=2070&auto=format&fit=crop',
    ],
    is_active: true,
  },
  {
    name: 'Electrical System Repair',
    description_en: 'Expert electrical system diagnostics and repair for all bus electrical components, including lighting, wiring, alternators, and onboard electronics.',
    description_ka: 'ელექტრული სისტემის ექსპერტული დიაგნოსტიკა და შეკეთება ყველა ელექტრული კომპონენტისთვის, მათ შორის განათება, გაყვანილობა და ბორტის ელექტრონიკა.',
    description_ru: 'Экспертная диагностика и ремонт электрической системы для всех электрических компонентов, включая освещение, проводку и бортовую электронику.',
    photos: [
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=2069&auto=format&fit=crop',
    ],
    is_active: true,
  },
]

// POST /api/admin/seed-services
export async function POST() {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createServiceClient()

    // Check existing services
    const existingResult = await supabase
      .from('services')
      .select('id, name')
    const existingServices = existingResult.data as { id: string; name: string }[] | null

    const results = []

    for (const serviceData of SEED_SERVICES) {
      const existing = existingServices?.find(s => s.name === serviceData.name)

      if (existing) {
        const { error } = await (supabase
          .from('services') as unknown as { update: (data: Record<string, unknown>) => { eq: (col: string, val: string) => Promise<{ error: { message: string } | null }> } })
          .update(serviceData)
          .eq('id', existing.id)

        if (error) {
          results.push({ name: serviceData.name, action: 'update_failed', error: error.message })
        } else {
          results.push({ name: serviceData.name, action: 'updated' })
        }
      } else {
        const { error } = await (supabase
          .from('services') as unknown as { insert: (data: Record<string, unknown>[]) => Promise<{ error: { message: string } | null }> })
          .insert([serviceData])

        if (error) {
          results.push({ name: serviceData.name, action: 'insert_failed', error: error.message })
        } else {
          results.push({ name: serviceData.name, action: 'inserted' })
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Service data seeded successfully',
      results,
    })
  } catch (error) {
    console.error('Error seeding services:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
