import 'server-only'
import { createClient } from '@supabase/supabase-js'

function buildClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL is required')
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is required')
  return createClient(url, key, {
    db: { schema: 'carnivore' },
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

let cached: ReturnType<typeof buildClient> | null = null

export function getSupabaseAdmin() {
  if (!cached) cached = buildClient()
  return cached
}
