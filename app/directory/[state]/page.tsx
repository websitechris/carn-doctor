import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  getArticlesByState,
  getExpertsByState,
  getStateCodeFromSlug,
  getYouTubeExperts,
} from '@/lib/api'
import { StateTabs } from '@/components/state-tabs'
import { supabase } from '@/lib/supabase'
import type { StateContent } from '@/lib/types'

export const dynamic = 'force-dynamic'

type PageProps = { params: Promise<{ state: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state: slug } = await params
  const { data: content } = await supabase
    .from('state_directory_content')
    .select('*')
    .eq('state_slug', slug)
    .maybeSingle()

  if (!content) {
    return {
      title: `Metabolic Health in ${slug} | Carnivore Doctor`,
      description: undefined,
    }
  }

  return {
    title: content.meta_description || `${content.state_name} — Metabolic Health Directory | Carnivore Doctor`,
    description: content.meta_description ?? undefined,
  }
}

export default async function StateDirectoryPage({ params }: PageProps) {
  const { state: slug } = await params

  const { data: stateContent } = await supabase
    .from('state_directory_content')
    .select('*')
    .eq('state_slug', slug)
    .maybeSingle()

  const stateCode = getStateCodeFromSlug(slug)
  if (!stateCode) notFound()

  const [practitioners, nationalExperts, stateArticles] = await Promise.all([
    getExpertsByState(stateCode),
    getYouTubeExperts(),
    getArticlesByState(stateCode),
  ])

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-2">
          <h1 className="text-4xl font-bold tracking-tight text-slate-800 sm:text-5xl">
            {stateContent?.state_name ?? slug.replace(/-/g, ' ')}
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Verified Metabolic Health &amp; Carnivore-Friendly Practitioners
          </p>
        </header>

        <StateTabs
          stateContent={stateContent as StateContent | null}
          stateName={stateContent?.state_name ?? slug.replace(/(^\w|-\w)/g, (m) => m.replace('-', ' ').toUpperCase())}
          practitioners={practitioners}
          nationalExperts={nationalExperts}
          stateArticles={stateArticles}
        />
      </div>
    </main>
  )
}
