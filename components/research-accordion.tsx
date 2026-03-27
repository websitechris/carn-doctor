import type { StateContent } from '@/lib/types'

type Section = {
  title: string
  key: keyof Pick<
    StateContent,
    | 'executive_summary'
    | 'academic_vanguard'
    | 'private_sector_analysis'
    | 'functional_landscape'
    | 'dpc_revolution'
  >
}

const SECTIONS: Section[] = [
  { title: 'Clinical Overview', key: 'executive_summary' },
  { title: 'Academic Institutions', key: 'academic_vanguard' },
  { title: 'Private Specialists', key: 'private_sector_analysis' },
  { title: 'Functional Medicine', key: 'functional_landscape' },
  { title: 'Direct Primary Care', key: 'dpc_revolution' },
]

type Props = {
  stateContent: StateContent
}

export function ResearchAccordion({ stateContent }: Props) {
  const items = SECTIONS.filter((s) => stateContent[s.key]?.trim())

  if (items.length === 0) return null

  return (
    <div className="space-y-3">
      {items.map((s) => (
        <details
          key={s.key}
          className="group rounded-lg border border-slate-100 border-l-4 border-l-blue-600 bg-white shadow-sm"
        >
          <summary className="cursor-pointer list-none px-5 py-4 text-lg font-semibold text-slate-800 [&::-webkit-details-marker]:hidden">
            <span className="flex items-center justify-between gap-2">
              {s.title}
              <span className="text-sm font-normal text-slate-400 group-open:rotate-180">▼</span>
            </span>
          </summary>
          <div
            className="border-t border-slate-100 px-5 pb-5 pt-2 text-slate-700 leading-relaxed [&_a]:text-blue-600 [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: stateContent[s.key]!.trim() }}
          />
        </details>
      ))}
    </div>
  )
}
