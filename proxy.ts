import { NextRequest, NextResponse } from 'next/server'

const PROTECTED_ROUTES: Record<string, string[]> = {
  client:      ['/portal'],
  agency_user: ['/dashboard'],
  agent:       ['/dashboard'],
  super_admin: ['/portal', '/dashboard', '/super-admin'],
}

const HOME_ROUTES: Record<string, string> = {
  client:      '/portal',
  agency_user: '/dashboard',
  agent:       '/dashboard',
  super_admin: '/super-admin',
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const accountType = req.cookies.get('account_type')?.value

  if (pathname === '/login') {
    // ✅ Session expirée : on efface le cookie ici côté serveur
    const expired = req.nextUrl.searchParams.get('expired')
    if (expired === '1') {
      const response = NextResponse.next()
      response.cookies.set('account_type', '', {
        expires: new Date(0),
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      })
      return response
    }

    if (accountType && HOME_ROUTES[accountType]) {
      return NextResponse.redirect(new URL(HOME_ROUTES[accountType], req.url))
    }
    return NextResponse.next()
  }

  if (!accountType) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  const allowedPrefixes = PROTECTED_ROUTES[accountType] ?? []
  const hasAccess = allowedPrefixes.some(prefix => pathname.startsWith(prefix))

  if (!hasAccess) {
    return NextResponse.redirect(new URL(HOME_ROUTES[accountType] ?? '/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/login',
    '/portal/:path*',
    '/dashboard/:path*',
    '/super-admin/:path*',
  ],
}