import type { Expert } from '@/lib/types'

type Props = {
  stateName: string
  practitioners: Expert[]
}

function tierCounts(ps: Expert[]) {
  let t1 = 0,
    t2 = 0,
    t3 = 0
  for (const p of ps) {
    const t = p.tier ?? 3
    if (t === 1) t1++
    else if (t === 2) t2++
    else t3++
  }
  return { t1, t2, t3 }
}

function categoryCounts(ps: Expert[]): { name: string; count: number }[] {
  const m = new Map<string, number>()
  for (const p of ps) {
    const c = p.category?.trim()
    if (!c) continue
    m.set(c, (m.get(c) ?? 0) + 1)
  }
  return [...m.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

function telehealthSplit(ps: Expert[]) {
  let tele = 0
  for (const p of ps) {
    if (p.is_telehealth === true) tele++
  }
  return { tele, inPerson: ps.length - tele }
}

function HorizontalBarChart({
  title,
  rows,
  emptyLabel,
}: {
  title: string
  rows: { label: string; value: number; fill: string }[]
  emptyLabel: string
}) {
  const max = Math.max(...rows.map((r) => r.value), 1)
  const h = 36

  return (
    <div className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-slate-800">{title}</h3>
      {rows.every((r) => r.value === 0) ? (
        <p className="text-sm text-slate-500">{emptyLabel}</p>
      ) : (
        <svg
          className="w-full"
          viewBox={`0 0 320 ${rows.length * h + 8}`}
          role="img"
          aria-label={title}
        >
          {rows.map((r, i) => {
            const y = i * h + 6
            const barW = (r.value / max) * 260
            return (
              <g key={r.label} transform={`translate(0, ${y})`}>
                <text x={0} y={12} className="fill-slate-600" style={{ fontSize: 11 }}>
                  {r.label} · {r.value}
                </text>
                <rect x={0} y={18} width={280} height={14} rx={3} className="fill-slate-100" />
                <rect x={0} y={18} width={barW} height={14} rx={3} fill={r.fill} />
              </g>
            )
          })}
        </svg>
      )}
    </div>
  )
}

function TelehealthDonut({ tele, inPerson }: { tele: number; inPerson: number }) {
  const total = tele + inPerson
  if (total === 0) {
    return (
      <div className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-slate-800">Telehealth vs In-Person</h3>
        <p className="text-sm text-slate-500">No practitioner data yet.</p>
      </div>
    )
  }

  const telePct = tele / total
  const cx = 100
  const cy = 100
  const outer = 75
  const inner = 48
  const tau = Math.PI * 2

  function arc(start: number, angle: number, rOut: number, rIn: number) {
    if (angle <= 0) return ''
    const x1 = cx + rOut * Math.cos(start)
    const y1 = cy + rOut * Math.sin(start)
    const x2 = cx + rOut * Math.cos(start + angle)
    const y2 = cy + rOut * Math.sin(start + angle)
    const x3 = cx + rIn * Math.cos(start + angle)
    const y3 = cy + rIn * Math.sin(start + angle)
    const x4 = cx + rIn * Math.cos(start)
    const y4 = cy + rIn * Math.sin(start)
    const large = angle > Math.PI ? 1 : 0
    return [
      `M ${x1} ${y1}`,
      `A ${rOut} ${rOut} 0 ${large} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${rIn} ${rIn} 0 ${large} 0 ${x4} ${y4}`,
      'Z',
    ].join(' ')
  }

  const start = -Math.PI / 2
  const a1 = telePct * tau
  const a2 = (1 - telePct) * tau
  /** SVG arcs cannot reliably sweep a full 360°; nudge so the ring always draws. */
  const fullRing = tau - 1e-4
  const pathTele =
    tele === total
      ? arc(start, fullRing, outer, inner)
      : a1 > 0
        ? arc(start, a1, outer, inner)
        : ''
  const pathInPerson =
    tele === 0
      ? arc(start, fullRing, outer, inner)
      : a2 > 0
        ? arc(start + a1, a2, outer, inner)
        : ''

  return (
    <div className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-slate-800">Telehealth vs In-Person</h3>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <svg viewBox="0 0 200 200" className="h-44 w-44 shrink-0" role="img" aria-label="Telehealth split">
          {pathInPerson ? <path d={pathInPerson} className="fill-slate-300" /> : null}
          {pathTele ? <path d={pathTele} className="fill-blue-600" /> : null}
        </svg>
        <ul className="space-y-2 text-sm text-slate-700">
          <li className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-blue-600" />
            Telehealth: {tele} ({Math.round(telePct * 100)}%)
          </li>
          <li className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-slate-300" />
            In-person: {inPerson} ({Math.round((1 - telePct) * 100)}%)
          </li>
        </ul>
      </div>
    </div>
  )
}

const TRENDS: { title: string; body: string }[] = [
  {
    title: 'The Rise of Obesity Medicine (ABOM)',
    body:
      'Board-certified obesity medicine physicians are increasingly comfortable with carbohydrate restriction as a therapeutic lever. Many integrate continuous glucose monitoring, body-composition assessment, and medication deprescribing—skills that overlap with metabolic and carnivore-adjacent care even when marketing language stays conservative.',
  },
  {
    title: 'Direct Primary Care: The Time Advantage',
    body:
      'DPC practices often offer longer visits and subscription-based access, which makes nuanced nutrition counselling feasible. Without fee-for-service time pressure, clinicians can document goals, follow labs over time, and adjust plans based on patient response rather than one-size-fits-all guidelines.',
  },
  {
    title: 'Functional Medicine: Medical vs Chiropractic',
    body:
      '“Functional medicine” appears across credentialed medical doctors, DOs, NPs, and chiropractic-led clinics. Legitimate metabolic work can emerge from any setting, but training depth and prescribing scope differ. Patients should verify who interprets labs, who orders imaging, and how emergencies are triaged—regardless of clinic sign.',
  },
  {
    title: 'Telehealth: Equalising Rural Access',
    body:
      'Virtual visits expand access where local specialists are scarce. Licensing rules still vary by state; some clinicians offer education-only or coaching models where prescribing is limited. National directories increasingly list telehealth-friendly providers alongside in-person practices for the same reason.',
  },
]

export function StateInsightsPanel({ stateName, practitioners }: Props) {
  const { t1, t2, t3 } = tierCounts(practitioners)
  const cats = categoryCounts(practitioners)
  const { tele, inPerson } = telehealthSplit(practitioners)

  const palette = ['#2563eb', '#0891b2', '#7c3aed', '#db2777', '#ca8a04', '#16a34a', '#ea580c', '#64748b']
  const catRows =
    cats.length > 0
      ? cats.slice(0, 8).map((c, i) => ({
          label: c.name,
          value: c.count,
          fill: palette[i % palette.length]!,
        }))
      : [{ label: 'Uncategorised', value: 0, fill: '#94a3b8' }]

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">{stateName} Metabolic Health Landscape</h2>
        <p className="mt-1 text-slate-600">Snapshot of verified listings in this directory.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <HorizontalBarChart
          title="Practitioners by Tier"
          emptyLabel="No tier data yet."
          rows={[
            { label: 'Tier 1', value: t1, fill: '#16a34a' },
            { label: 'Tier 2', value: t2, fill: '#d97706' },
            { label: 'Tier 3', value: t3, fill: '#94a3b8' },
          ]}
        />
        <HorizontalBarChart
          title="Practitioners by Category"
          emptyLabel="No category values on listings yet."
          rows={catRows}
        />
        <TelehealthDonut tele={tele} inPerson={inPerson} />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-800">Key Trends</h3>
        <div className="mt-4 space-y-3">
          {TRENDS.map((item) => (
            <details
              key={item.title}
              className="rounded-lg border border-slate-100 border-l-4 border-l-blue-600 bg-white shadow-sm"
            >
              <summary className="cursor-pointer list-none px-5 py-4 font-medium text-slate-800 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-2">
                  {item.title}
                  <span className="text-sm font-normal text-slate-400">▼</span>
                </span>
              </summary>
              <p className="border-t border-slate-100 px-5 pb-5 pt-3 text-sm leading-relaxed text-slate-600">
                {item.body}
              </p>
            </details>
          ))}
        </div>
      </div>
    </div>
  )
}
