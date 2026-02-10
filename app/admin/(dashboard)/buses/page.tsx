import { createClient } from '@/lib/supabase/server'
import type { Bus } from '@/types/database'
import BusesTable from './BusesTable'
import styles from './page.module.css'

export const metadata = {
  title: 'Manage Buses | LuxTravel Admin',
  description: 'Manage your bus fleet',
}

async function getBuses(): Promise<Bus[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('buses')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching buses:', error)
    return []
  }

  return data || []
}

export default async function BusesPage() {
  const buses = await getBuses()

  return (
    <div className={styles.page}>
      <BusesTable initialBuses={buses} />
    </div>
  )
}
