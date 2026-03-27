export interface StateContent {
  id: string
  state_name: string
  state_slug: string
  executive_summary: string | null
  academic_vanguard: string | null
  private_sector_analysis: string | null
  functional_landscape: string | null
  dpc_revolution: string | null
  meta_description: string | null
}

export interface Expert {
  id: string
  name: string
  credentials?: string | null
  specialty?: string | null
  bio_summary?: string | null
  alignment_score?: number | null
  is_practicing?: boolean | null
  primary_focus?: string | null
  category?: string | null
  flags?: string | null
  phone?: string | null
  evidence_summary?: string | null
  practice_name?: string | null
  tier?: number | null
  state_code?: string | null
  is_telehealth?: boolean | null
  website?: string | null
  referral_url?: string | null
  address?: string | null
  city?: string | null
  latitude?: number | null
  longitude?: number | null
  site_id?: string | null
  youtube_id?: string | null
  scientific_hook?: string | null
}
