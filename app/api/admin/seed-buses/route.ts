import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

const SEED_BUSES = [
  {
    name: 'Mercedes-Benz Tourismo',
    class: 'VIP',
    capacity: 50,
    description_en: 'Experience ultimate luxury with our flagship Mercedes-Benz Tourismo. Featuring leather seats, personal entertainment systems, and premium amenities for an unforgettable journey.',
    description_ka: 'განიცადეთ უმაღლესი ფუფუნება ჩვენი ფლაგმანი Mercedes-Benz Tourismo-ით. ტყავის სავარძლები, პირადი გასართობი სისტემები და პრემიუმ კომფორტი დაუვიწყარი მოგზაურობისთვის.',
    description_ru: 'Испытайте роскошь с нашим флагманским Mercedes-Benz Tourismo. Кожаные сиденья, персональные развлекательные системы и премиум удобства для незабываемого путешествия.',
    amenities: ['wifi', 'air_conditioning', 'leather_seats', 'usb_charging', 'entertainment_system', 'toilet', 'minibar', 'reclining_seats'],
    photos: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2671&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1557223562-6c77ef16210f?q=80&w=2070&auto=format&fit=crop',
    ],
    is_active: true,
    maintenance_status: 'operational',
  },
  {
    name: 'Setra S 516 HDH',
    class: 'VIP',
    capacity: 48,
    description_en: 'The Setra S 516 HDH offers exceptional comfort with its spacious interior, panoramic windows, and state-of-the-art technology for the most discerning travelers.',
    description_ka: 'Setra S 516 HDH გთავაზობთ განსაკუთრებულ კომფორტს თავისი ვრცელი ინტერიერით, პანორამული ფანჯრებით და თანამედროვე ტექნოლოგიით ყველაზე მომთხოვნი მოგზაურებისთვის.',
    description_ru: 'Setra S 516 HDH предлагает исключительный комфорт с просторным интерьером, панорамными окнами и современными технологиями для самых взыскательных путешественников.',
    amenities: ['wifi', 'air_conditioning', 'leather_seats', 'usb_charging', 'entertainment_system', 'toilet', 'panoramic_windows'],
    photos: [
      'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600706432502-77a0e2e32431?q=80&w=2072&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2671&auto=format&fit=crop',
    ],
    is_active: true,
    maintenance_status: 'operational',
  },
  {
    name: "MAN Lion's Coach",
    class: 'Comfort',
    capacity: 55,
    description_en: "Our MAN Lion's Coach provides reliable comfort for medium to large groups. Perfect for corporate events, tours, and long-distance travel with all essential amenities.",
    description_ka: "ჩვენი MAN Lion's Coach უზრუნველყოფს საიმედო კომფორტს საშუალო და დიდი ჯგუფებისთვის. იდეალურია კორპორატიული ღონისძიებებისთვის, ტურებისთვის და შორ მანძილებზე მოგზაურობისთვის.",
    description_ru: "Наш MAN Lion's Coach обеспечивает надежный комфорт для средних и больших групп. Идеально подходит для корпоративных мероприятий, туров и дальних поездок.",
    amenities: ['wifi', 'air_conditioning', 'usb_charging', 'toilet', 'reclining_seats'],
    photos: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=2032&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop',
    ],
    is_active: true,
    maintenance_status: 'operational',
  },
  {
    name: 'Volvo 9700',
    class: 'Comfort',
    capacity: 52,
    description_en: 'The Volvo 9700 combines Scandinavian design with comfort and safety. An excellent choice for long-distance travel with modern amenities and reliable performance.',
    description_ka: 'Volvo 9700 აერთიანებს სკანდინავიურ დიზაინს კომფორტთან და უსაფრთხოებასთან. შესანიშნავი არჩევანი შორ მანძილებზე მოგზაურობისთვის თანამედროვე კომფორტითა და საიმედო მუშაობით.',
    description_ru: 'Volvo 9700 сочетает скандинавский дизайн с комфортом и безопасностью. Отличный выбор для дальних поездок с современными удобствами и надежной работой.',
    amenities: ['wifi', 'air_conditioning', 'usb_charging', 'toilet', 'reclining_seats', 'reading_lights'],
    photos: [
      'https://images.unsplash.com/photo-1600706432502-77a0e2e32431?q=80&w=2072&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1557223562-6c77ef16210f?q=80&w=2070&auto=format&fit=crop',
    ],
    is_active: true,
    maintenance_status: 'operational',
  },
  {
    name: 'Iveco Magelys',
    class: 'Standard',
    capacity: 60,
    description_en: 'Our Iveco Magelys offers reliable transportation for larger groups at an affordable price without compromising on essential comfort and safety features.',
    description_ka: 'ჩვენი Iveco Magelys გთავაზობთ საიმედო ტრანსპორტირებას დიდი ჯგუფებისთვის ხელმისაწვდომ ფასად კომფორტსა და უსაფრთხოებაზე კომპრომისის გარეშე.',
    description_ru: 'Наш Iveco Magelys предлагает надежную перевозку для больших групп по доступной цене без ущерба для комфорта и безопасности.',
    amenities: ['air_conditioning', 'usb_charging', 'reclining_seats'],
    photos: [
      'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2671&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=2032&auto=format&fit=crop',
    ],
    is_active: true,
    maintenance_status: 'operational',
  },
]

// POST /api/admin/seed-buses
export async function POST() {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createServiceClient()

    // Check existing buses
    const { data: existingBuses } = await supabase
      .from('buses')
      .select('id, name')

    const results = []

    for (const busData of SEED_BUSES) {
      const existing = existingBuses?.find(b => b.name === busData.name)

      if (existing) {
        // Update existing bus with images and data
        const { error } = await supabase
          .from('buses')
          .update({
            ...busData,
            amenities: JSON.stringify(busData.amenities),
          })
          .eq('id', existing.id)

        if (error) {
          results.push({ name: busData.name, action: 'update_failed', error: error.message })
        } else {
          results.push({ name: busData.name, action: 'updated' })
        }
      } else {
        // Insert new bus
        const { error } = await supabase
          .from('buses')
          .insert([{
            ...busData,
            amenities: JSON.stringify(busData.amenities),
          }])

        if (error) {
          results.push({ name: busData.name, action: 'insert_failed', error: error.message })
        } else {
          results.push({ name: busData.name, action: 'inserted' })
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Bus data seeded successfully',
      results,
    })
  } catch (error) {
    console.error('Error seeding buses:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
