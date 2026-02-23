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

// DELETE /api/admin/buses?id=xxx
export async function DELETE(request: NextRequest) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const busId = searchParams.get('id')

  if (!busId) {
    return NextResponse.json({ error: 'Bus ID is required' }, { status: 400 })
  }

  try {
    const supabase = createServiceClient()

    // First get the bus to find its photos
    const busResult = await supabase
      .from('buses')
      .select('photos')
      .eq('id', busId)
      .single()
    const bus = busResult.data as { photos: string[] } | null
    const fetchError = busResult.error

    if (fetchError || !bus) {
      return NextResponse.json({ error: 'Bus not found' }, { status: 404 })
    }

    // Delete photos from storage
    if (bus.photos && bus.photos.length > 0) {
      const filePaths = bus.photos
        .map((url: string) => {
          const parts = url.split('/storage/v1/object/public/bus-images/')
          return parts.length > 1 ? parts[1] : null
        })
        .filter((p: string | null): p is string => p !== null)

      if (filePaths.length > 0) {
        await supabase.storage.from('bus-images').remove(filePaths)
      }
    }

    // Delete the bus record
    const { error: deleteError } = await supabase
      .from('buses')
      .delete()
      .eq('id', busId)

    if (deleteError) {
      return NextResponse.json({ error: 'Failed to delete bus' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting bus:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
