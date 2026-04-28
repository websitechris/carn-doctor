'use server'

import { cookies } from 'next/headers'
import { ADMIN_SESSION_COOKIE, verifySession } from '@/lib/admin-session'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export type SaveArticleInput = {
  id: string | null
  slug: string
  title: string
  metaDescription: string
  excerpt: string
  content: string
  category: string
  stateCode: string
  published: boolean
  storedPublishedAt: string | null
}

export type SaveArticleResult =
  | { ok: true; mode: 'created' | 'updated' }
  | { ok: false; error: string }

async function requireAdmin() {
  const jar = await cookies()
  const session = jar.get(ADMIN_SESSION_COOKIE)?.value
  if (!(await verifySession(session))) {
    throw new Error('Not authorized')
  }
}

export async function saveArticleAction(input: SaveArticleInput): Promise<SaveArticleResult> {
  await requireAdmin()

  const slug = input.slug.trim()
  const title = input.title.trim()
  if (!title || !slug) {
    return { ok: false, error: 'Title and slug are required.' }
  }

  const publishedAt = input.published
    ? input.storedPublishedAt || new Date().toISOString()
    : null

  const row = {
    site_id: 'carnivore' as const,
    slug,
    title,
    meta_description: input.metaDescription.trim() || null,
    excerpt: input.excerpt.trim() || null,
    content: input.content.trim() || null,
    category: input.category.trim() || null,
    state_code: input.stateCode.trim() || null,
    published: input.published,
    published_at: publishedAt,
  }

  const db = getSupabaseAdmin()

  if (input.id) {
    const { error } = await db.from('articles').update(row).eq('id', input.id)
    if (error) return { ok: false, error: error.message }
    return { ok: true, mode: 'updated' }
  }

  const { error } = await db.from('articles').insert(row)
  if (error) return { ok: false, error: error.message }
  return { ok: true, mode: 'created' }
}
