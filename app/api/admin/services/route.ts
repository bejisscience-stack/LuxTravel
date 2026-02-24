import { NextRequest, NextResponse } from 'next/server'
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

// DELETE /api/admin/services?id=xxx
export async function DELETE(request: NextRequest) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const serviceId = searchParams.get('id')

  if (!serviceId) {
    return NextResponse.json({ error: 'Service ID is required' }, { status: 400 })
  }

  try {
    const supabase = createServiceClient()

    // First get the service to find its photos
    const serviceResult = await supabase
      .from('services')
      .select('photos')
      .eq('id', serviceId)
      .single()
    const service = serviceResult.data as { photos: string[] } | null
    const fetchError = serviceResult.error

    if (fetchError || !service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    // Delete photos from storage
    if (service.photos && service.photos.length > 0) {
      const filePaths = service.photos
        .map((url: string) => {
          const parts = url.split('/storage/v1/object/public/service-images/')
          return parts.length > 1 ? parts[1] : null
        })
        .filter((p: string | null): p is string => p !== null)

      if (filePaths.length > 0) {
        await supabase.storage.from('service-images').remove(filePaths)
      }
    }

    // Delete the service record
    const { error: deleteError } = await supabase
      .from('services')
      .delete()
      .eq('id', serviceId)

    if (deleteError) {
      return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
