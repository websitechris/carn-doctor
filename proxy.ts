import { NextResponse, type NextRequest } from 'next/server'
import { ADMIN_SESSION_COOKIE, verifySession } from '@/lib/admin-session'

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === '/admin/login' || pathname === '/admin/logout') {
    return NextResponse.next()
  }

  const cookie = req.cookies.get(ADMIN_SESSION_COOKIE)?.value
  if (await verifySession(cookie)) {
    return NextResponse.next()
  }

  const url = req.nextUrl.clone()
  url.pathname = '/admin/login'
  url.search = ''
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/admin/:path*'],
}
