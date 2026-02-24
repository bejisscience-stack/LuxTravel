import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ServiceForm from '@/components/admin/ServiceForm'
import type { Service } from '@/types/database'

export const metadata = {
  title: 'Edit Service | LuxTravel Admin',
  description: 'Edit service details',
}

interface EditServicePageProps {
  params: {
    id: string
  }
}

async function getService(id: string): Promise<Service | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export default async function EditServicePage({ params }: EditServicePageProps) {
  const { id } = params
  const service = await getService(id)

  if (!service) {
    notFound()
  }

  return <ServiceForm service={service} isEditing />
}
