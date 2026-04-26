import Link from 'next/link'
import { getExperts } from '@/lib/api'
import type { Expert } from '@/lib/types'
import { isLikelyYouTubeVideoId, resolveYoutubeHref, youtubeThumbnailUrl } from '@/lib/youtube'
import { supabase } from '@/lib/supabase'

export default async function Home() {
  const experts = await getExperts()
  const { count } = await supabase
    .from('experts')
    .select('*', { count: 'exact', head: true })
    .eq('site_id', 'carnivore')
    .not('state_code', 'is', null)
  const { data: stateList } = await supabase
    .from('state_directory_content')
    .select('state_slug, state_name')
    .order('state_name', { ascending: true })

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-slate-900 px-4 pb-16 pt-14 text-white sm:px-6 sm:pb-20 sm:pt-20 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Find a Carnivore &amp; Metabolic Health Doctor
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl">
            The most comprehensive directory of practitioners open to therapeutic carbohydrate restriction,
            carnivore, and ketogenic medicine in the United States
          </p>
          <div className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
            <Link
              href="#states"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-900/30 transition hover:bg-blue-500"
            >
              Find a Doctor in Your State →
            </Link>
            <a
              href="#national-experts"
              className="inline-flex items-center justify-center rounded-lg border border-slate-600 bg-slate-800/50 px-6 py-3.5 text-base font-semibold text-white backdrop-blur transition hover:border-slate-500 hover:bg-slate-800"
            >
              Browse National Experts →
            </a>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="border-y border-slate-800 bg-slate-950 px-4 py-4 sm:px-6 lg:px-8">
        <p className="mx-auto max-w-5xl text-center text-sm font-medium text-slate-400 sm:text-base">
          <span className="text-slate-200">51 State Directories</span>
          <span className="mx-2 text-slate-600" aria-hidden="true">
            ·
          </span>
          <span>{count?.toLocaleString()}+ Practitioners</span>
          <span className="mx-2 text-slate-600" aria-hidden="true">
            ·
          </span>
          <span>12 National Experts</span>
          <span className="mx-2 text-slate-600" aria-hidden="true">
            ·
          </span>
          <span>Growing Daily</span>
        </p>
      </div>

      {/* Browse by state */}
      <section id="states" className="bg-slate-50 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Browse by State</h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            Metabolic health practitioner directories for all 50 states and Washington DC.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(stateList ?? []).map((s) => (
              <article
                key={s.state_slug}
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md"
              >
                <h3 className="text-2xl font-bold text-slate-900">{s.state_name}</h3>
                <Link
                  href={`/directory/${s.state_slug}`}
                  className="mt-6 inline-flex text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  View Directory →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* National experts */}
      <section id="national-experts" className="scroll-mt-24 bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <header className="mb-10 max-w-3xl">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Leading Voices in Carnivore &amp; Metabolic Medicine
            </h2>
            <p className="mt-3 text-lg text-slate-600">
              These doctors and researchers openly discuss carnivore and ketogenic approaches in their work
            </p>
          </header>

          {experts.length === 0 ? (
            <p className="rounded-xl border border-slate-200 bg-slate-50 p-10 text-center text-slate-600">
              National expert profiles are being curated. Check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {experts.map((expert: Expert) => (
                <NationalExpertCard key={expert.id} expert={expert} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t border-slate-200 bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-base leading-relaxed text-slate-700">
            Is your state not listed yet? We are adding new states weekly. The full 51-state directory is
            coming soon.
          </p>
        </div>
      </section>
    </main>
  )
}

function NationalExpertCard({ expert }: { expert: Expert }) {
  const yt = expert.youtube_id?.trim() ?? ''
  const thumb = yt ? youtubeThumbnailUrl(yt) : null
  const href = resolveYoutubeHref(expert.youtube_id, expert.name)

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <a href={href} target="_blank" rel="noopener noreferrer" className="relative block aspect-video bg-slate-200">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center bg-slate-800 text-sm font-medium text-slate-200">
            {isLikelyYouTubeVideoId(yt) ? 'YouTube' : 'Watch'}
          </div>
        )}
      </a>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-slate-900">{expert.name}</h3>
        {expert.credentials?.trim() ? (
          <p className="mt-1 text-sm font-semibold text-slate-800">{expert.credentials}</p>
        ) : null}
        {expert.primary_focus?.trim() ? (
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{expert.primary_focus}</p>
        ) : null}
        {expert.scientific_hook?.trim() ? (
          <p className="mt-3 text-sm italic leading-relaxed text-slate-500">{expert.scientific_hook}</p>
        ) : null}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex w-full justify-center rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Watch on YouTube
        </a>
      </div>
    </article>
  )
}
