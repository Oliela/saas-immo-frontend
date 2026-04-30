// app/proxy.ts
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

  // Si connecté et va sur /login → redirige vers son espace
  if (pathname === '/login') {
    if (accountType && HOME_ROUTES[accountType]) {
      return NextResponse.redirect(new URL(HOME_ROUTES[accountType], req.url))
    }
    return NextResponse.next()
  }

  // Pas connecté → login
  if (!accountType) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Vérifie l'accès à la route
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
    '/portal',
    '/portal/:path*',
    '/dashboard',
    '/dashboard/:path*',
    '/super-admin',
    '/super-admin/:path*',
    '/api/clear-session'
  ],
}