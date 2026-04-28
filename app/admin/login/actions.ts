'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_TTL_SECONDS, signSession } from '@/lib/admin-session'

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let mismatch = 0
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return mismatch === 0
}

export async function loginAction(formData: FormData) {
  const submitted = String(formData.get('password') ?? '')
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) throw new Error('ADMIN_PASSWORD is not configured')

  if (!timingSafeEqual(submitted, expected)) {
    redirect('/admin/login?error=1')
  }

  const token = await signSession()
  const jar = await cookies()
  jar.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/admin',
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  })

  redirect('/admin')
}
