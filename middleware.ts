import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  let response = NextResponse.next({ request })

  // Only use Supabase when env vars are set (so middleware never crashes)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseAnonKey) {
    try {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[]) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            response = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2])
            )
          },
        },
      })

      const {
        data: { user },
      } = await supabase.auth.getUser()

      // Protect admin routes (except login page)
      if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
        if (!user) {
          const loginUrl = new URL('/admin/login', request.url)
          loginUrl.searchParams.set('redirectTo', pathname)
          return NextResponse.redirect(loginUrl)
        }
      }

      // Redirect authenticated users away from login page
      if (pathname === '/admin/login' && user) {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
    } catch {
      // If Supabase fails, continue without auth so the site still loads
    }
  } else {
    // No Supabase config: protect admin by redirecting to login (user can't log in without Supabase)
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
