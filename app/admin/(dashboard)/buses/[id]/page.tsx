import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BusForm from '@/components/admin/BusForm'
import type { Bus } from '@/types/database'

export const metadata = {
  title: 'Edit Bus | LuxTravel Admin',
  description: 'Edit bus details',
}

interface EditBusPageProps {
  params: {
    id: string
  }
}

async function getBus(id: string): Promise<Bus | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('buses')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export default async function EditBusPage({ params }: EditBusPageProps) {
  const { id } = params
  const bus = await getBus(id)

  if (!bus) {
    notFound()
  }

  return <BusForm bus={bus} isEditing />
}
