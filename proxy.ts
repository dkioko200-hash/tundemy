import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isAuthPage = path === '/auth/login' || path === '/auth/signup'
  const isProtectedRoute =
    path.startsWith('/dashboard') || path.startsWith('/employer/dashboard')

  // Logged-in users on auth pages → send to their dashboard
  if (user && isAuthPage) {
    const role = user.user_metadata?.role as string | undefined
    const destination = role === 'employer' ? '/employer/dashboard' : '/dashboard'
    return NextResponse.redirect(new URL(destination, request.url))
  }

  // Unauthenticated users on protected routes → send to login with return path
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('next', path)
    return NextResponse.redirect(url)
  }

  if (user) {
    const role = user.user_metadata?.role as string | undefined

    // Employers hitting the student dashboard → send to employer dashboard
    if (path.startsWith('/dashboard') && role === 'employer') {
      return NextResponse.redirect(new URL('/employer/dashboard', request.url))
    }

    // Non-employers hitting the employer dashboard → send to student dashboard
    if (path.startsWith('/employer/dashboard') && role !== 'employer') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/employer/dashboard/:path*',
    '/auth/login',
    '/auth/signup',
  ],
}
