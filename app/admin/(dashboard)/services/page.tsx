import { createClient } from '@/lib/supabase/server'
import type { Service } from '@/types/database'
import ServicesTable from './ServicesTable'
import styles from './page.module.css'

export const metadata = {
  title: 'Manage Services | LuxTravel Admin',
  description: 'Manage your mechanic services',
}

async function getServices(): Promise<Service[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching services:', error)
    return []
  }

  return data || []
}

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <div className={styles.page}>
      <ServicesTable initialServices={services} />
    </div>
  )
}
