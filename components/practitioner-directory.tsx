'use client'

import { useMemo, useState } from 'react'
import type { Expert } from '@/lib/types'
import { PractitionerCard } from '@/components/practitioner-card'
import { PractitionerModal } from '@/components/practitioner-modal'

type Props = {
  practitioners: Expert[]
  stateName: string
}

function flagTokens(flags: string | null | undefined): string[] {
  if (!flags?.trim()) return []
  return flags
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function uniqueFlags(practitioners: Expert[]): string[] {
  const set = new Set<string>()
  for (const p of practitioners) {
    for (const t of flagTokens(p.flags)) set.add(t)
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b))
}

export function PractitionerDirectory({ practitioners, stateName }: Props) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTier, setSelectedTier] = useState<string>('all')
  const [selectedFlag, setSelectedFlag] = useState<string>('all')
  const [modalExpert, setModalExpert] = useState<Expert | null>(null)

  const flagOptions = useMemo(() => uniqueFlags(practitioners), [practitioners])

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    return practitioners.filter((p) => {
      if (selectedTier !== 'all') {
        const tier = p.tier ?? 3
        if (String(tier) !== selectedTier) return false
      }
      if (selectedFlag !== 'all') {
        const tokens = flagTokens(p.flags)
        if (!tokens.some((t) => t.toLowerCase() === selectedFlag.toLowerCase())) return false
      }
      if (!q) return true
      const hay = [
        p.name,
        p.credentials,
        p.practice_name,
        p.city,
        p.flags,
        p.specialty,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [practitioners, searchTerm, selectedTier, selectedFlag])

  const y = practitioners.length

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-slate-800">
        Verified Practitioners in {stateName}
      </h2>

      {y === 0 ? (
        <p className="mt-6 rounded-lg border border-amber-100 bg-amber-50/80 p-6 text-center text-slate-700 shadow-sm">
          Practitioners for this state are being verified. Check back soon.
        </p>
      ) : (
        <>
          <div className="mt-6 flex flex-col gap-4 md:flex-row md:flex-wrap md:items-end">
            <label className="flex min-w-[200px] flex-1 flex-col gap-1 text-sm font-medium text-slate-700">
              Search
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Name, practice, city…"
                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </label>
            <label className="flex min-w-[160px] flex-col gap-1 text-sm font-medium text-slate-700">
              Tier
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-800 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value="all">All tiers</option>
                <option value="1">Tier 1</option>
                <option value="2">Tier 2</option>
                <option value="3">Tier 3</option>
              </select>
            </label>
            <label className="flex min-w-[180px] flex-col gap-1 text-sm font-medium text-slate-700">
              Flag
              <select
                value={selectedFlag}
                onChange={(e) => setSelectedFlag(e.target.value)}
                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-800 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value="all">All flags</option>
                {flagOptions.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <p className="mt-4 text-sm text-slate-600">
            Showing {filtered.length} of {y} practitioners
          </p>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((expert) => (
              <PractitionerCard key={expert.id} expert={expert} onViewDetails={setModalExpert} />
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="mt-8 text-center text-slate-600">No practitioners match your filters.</p>
          ) : null}
        </>
      )}

      <PractitionerModal expert={modalExpert} onClose={() => setModalExpert(null)} />
    </section>
  )
}
