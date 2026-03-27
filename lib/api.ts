import { supabase } from '@/lib/supabase'
import type { Expert, StateContent } from '@/lib/types'

/** Slug (URL segment) → USPS state code. DC and WA disambiguation included. */
const STATE_SLUG_TO_CODE: Record<string, string> = {
  alabama: 'AL',
  alaska: 'AK',
  arizona: 'AZ',
  arkansas: 'AR',
  california: 'CA',
  colorado: 'CO',
  connecticut: 'CT',
  delaware: 'DE',
  florida: 'FL',
  georgia: 'GA',
  hawaii: 'HI',
  idaho: 'ID',
  illinois: 'IL',
  indiana: 'IN',
  iowa: 'IA',
  kansas: 'KS',
  kentucky: 'KY',
  louisiana: 'LA',
  maine: 'ME',
  maryland: 'MD',
  massachusetts: 'MA',
  michigan: 'MI',
  minnesota: 'MN',
  mississippi: 'MS',
  missouri: 'MO',
  montana: 'MT',
  nebraska: 'NE',
  nevada: 'NV',
  'new-hampshire': 'NH',
  'new-jersey': 'NJ',
  'new-mexico': 'NM',
  'new-york': 'NY',
  'north-carolina': 'NC',
  'north-dakota': 'ND',
  ohio: 'OH',
  oklahoma: 'OK',
  oregon: 'OR',
  pennsylvania: 'PA',
  'rhode-island': 'RI',
  'south-carolina': 'SC',
  'south-dakota': 'SD',
  tennessee: 'TN',
  texas: 'TX',
  utah: 'UT',
  vermont: 'VT',
  virginia: 'VA',
  washington: 'WA',
  'west-virginia': 'WV',
  wisconsin: 'WI',
  wyoming: 'WY',
  'washington-dc': 'DC',
}

export function getStateCodeFromSlug(slug: string): string | null {
  return STATE_SLUG_TO_CODE[slug.toLowerCase()] ?? null
}

export async function getStateContent(slug: string): Promise<StateContent | null> {
  const { data, error } = await supabase
    .from('state_directory_content')
    .select(
      'id, state_name, state_slug, executive_summary, academic_vanguard, private_sector_analysis, functional_landscape, dpc_revolution, meta_description',
    )
    .eq('state_slug', slug)
    .maybeSingle()

  if (error) throw error
  return data as StateContent | null
}

export async function getExpertsByState(stateCode: string): Promise<Expert[]> {
  const { data, error } = await supabase
    .from('experts')
    .select('*')
    .eq('state_code', stateCode)
    .eq('site_id', 'carnivore')
    .order('tier', { ascending: true })
    .order('name', { ascending: true })

  if (error) throw error
  return (data ?? []) as Expert[]
}

/** National / YouTube-focused experts (no state assignment). */
export async function getYouTubeExperts(): Promise<Expert[]> {
  const { data, error } = await supabase
    .from('experts')
    .select('*')
    .is('state_code', null)
    .eq('site_id', 'carnivore')
    .order('tier', { ascending: true })
    .order('name', { ascending: true })

  if (error) throw error
  return (data ?? []) as Expert[]
}
