import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { ADMIN_SESSION_COOKIE } from '@/lib/admin-session'

export async function POST(request: Request) {
  const jar = await cookies()
  jar.delete({ name: ADMIN_SESSION_COOKIE, path: '/admin' })
  const url = new URL('/admin/login', request.url)
  return NextResponse.redirect(url, { status: 303 })
}
