// app/api/clear-session/route.ts
import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.set('account_type', '', {
    expires: new Date(0),
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })
  return response
}