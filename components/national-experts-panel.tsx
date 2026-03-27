import type { Expert } from '@/lib/types'
import { isLikelyYouTubeVideoId, resolveYoutubeHref, youtubeThumbnailUrl } from '@/lib/youtube'

type Props = {
  experts: Expert[]
}

export function NationalExpertsPanel({ experts }: Props) {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Leading National Voices in Metabolic &amp; Carnivore Medicine</h2>
        <p className="mt-2 max-w-3xl text-slate-600">
          These practitioners offer telehealth nationwide or have significant educational content.
        </p>
      </header>

      {experts.length === 0 ? (
        <p className="rounded-lg border border-slate-100 bg-white p-8 text-center text-slate-600 shadow-sm">
          National expert profiles are being curated. Check back soon.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {experts.map((expert) => {
            const yt = expert.youtube_id?.trim() ?? ''
            const thumb = yt ? youtubeThumbnailUrl(yt) : null
            const href = resolveYoutubeHref(expert.youtube_id, expert.name)

            return (
              <article
                key={expert.id}
                className="flex flex-col overflow-hidden rounded-lg border border-slate-100 bg-white shadow-sm"
              >
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block aspect-video bg-slate-200"
                >
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumb} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-slate-800 text-sm font-medium text-white">
                      {isLikelyYouTubeVideoId(yt) ? 'YouTube' : 'Watch'}
                    </div>
                  )}
                </a>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-bold text-slate-800">{expert.name}</h3>
                  {expert.credentials?.trim() ? (
                    <p className="mt-1 text-sm font-semibold text-slate-700">{expert.credentials}</p>
                  ) : null}
                  {expert.primary_focus?.trim() ? (
                    <p className="mt-2 text-sm text-slate-600">{expert.primary_focus}</p>
                  ) : null}
                  {expert.scientific_hook?.trim() ? (
                    <p className="mt-3 text-sm italic text-slate-500">{expert.scientific_hook}</p>
                  ) : null}
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex w-full justify-center rounded-md bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Watch on YouTube
                  </a>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
