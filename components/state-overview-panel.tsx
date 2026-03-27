import type { Expert, StateContent } from '@/lib/types'
import { ResearchAccordion } from '@/components/research-accordion'

type Props = {
  stateContent: StateContent
  practitioners: Expert[]
}

export function StateOverviewPanel({ stateContent, practitioners }: Props) {
  const total = practitioners.length
  const tier1 = practitioners.filter((p) => p.tier === 1).length
  const tele = practitioners.filter((p) => p.is_telehealth === true).length

  return (
    <div className="space-y-8">
      <div
        className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950 shadow-sm"
        role="note"
      >
        Due to medical board guidelines, most practitioners cannot publicly endorse the carnivore diet. These
        providers specialise in therapeutic carbohydrate restriction, functional medicine, and metabolic health
        approaches that align with animal-based nutrition.
      </div>

      <section className="rounded-lg border border-slate-100 border-l-4 border-l-blue-600 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800">
          Why Doctors Don&apos;t Advertise Carnivore or Keto Approaches
        </h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
          <p>
            Medical boards and institutional protocols emphasise guideline-concordant messaging. Discussing
            carnivore or strict ketogenic therapy publicly can create perceived liability, peer scrutiny, or
            conflicts with employment policies—even when patients report benefit.
          </p>
          <p>
            Randomised trial evidence for long-term carnivore outcomes remains thin in mainstream literature,
            which makes many clinicians cautious about endorsement language even if they use carbohydrate
            restriction in practice.
          </p>
          <p>
            <strong className="text-slate-800">
              Many practitioners still support these approaches privately:
            </strong>{' '}
            longer visits, shared decision-making, and metabolic markers often tell a different story than
            public-facing websites. This directory highlights clinicians comfortable with therapeutic carb
            restriction and metabolic framing that aligns with animal-based nutrition—without requiring
            headline &quot;carnivore&quot; claims.
          </p>
        </div>
      </section>

      <ResearchAccordion stateContent={stateContent} />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-100 bg-white p-5 text-center shadow-sm">
          <p className="text-3xl font-bold text-blue-600">{total}</p>
          <p className="mt-1 text-sm font-medium text-slate-600">Total practitioners</p>
        </div>
        <div className="rounded-lg border border-slate-100 bg-white p-5 text-center shadow-sm">
          <p className="text-3xl font-bold text-green-600">{tier1}</p>
          <p className="mt-1 text-sm font-medium text-slate-600">Tier 1</p>
        </div>
        <div className="rounded-lg border border-slate-100 bg-white p-5 text-center shadow-sm">
          <p className="text-3xl font-bold text-slate-800">{tele}</p>
          <p className="mt-1 text-sm font-medium text-slate-600">Telehealth listings</p>
        </div>
      </div>
    </div>
  )
}
