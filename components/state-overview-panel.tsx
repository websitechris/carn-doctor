import type { Expert, StateContent } from '@/lib/types'

type Props = {
  stateContent: StateContent | null
  stateName: string
  practitioners: Expert[]
}

export function StateOverviewPanel({ stateContent, stateName, practitioners }: Props) {
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

      {stateContent ? (
        <div className="space-y-8 prose max-w-none">
          <section>
            <h2>Metabolic Health in {stateName}</h2>
            <p>{stateContent.executive_summary}</p>
          </section>
          <section>
            <h2>Academic &amp; Hospital Programmes</h2>
            <p>{stateContent.academic_vanguard}</p>
          </section>
          <section>
            <h2>Private &amp; Specialist Clinics</h2>
            <p>{stateContent.private_sector_analysis}</p>
          </section>
          <section>
            <h2>Functional &amp; Integrative Medicine</h2>
            <p>{stateContent.functional_landscape}</p>
          </section>
          <section>
            <h2>Direct Primary Care &amp; Telehealth</h2>
            <p>{stateContent.dpc_revolution}</p>
          </section>
        </div>
      ) : (
        <p>Content coming soon for this state.</p>
      )}

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
