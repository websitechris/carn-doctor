/** Shared tier visuals for cards and modal. */
export function getTierBorderClass(tier: number | null | undefined): string {
  const t = tier ?? 3
  if (t === 1) return 'border-l-green-600'
  if (t === 2) return 'border-l-amber-500'
  return 'border-l-slate-400'
}

export function getTierLabel(tier: number | null | undefined): string {
  const t = tier ?? 3
  if (t === 1) return 'Tier 1 — ABOM/IFMCP Certified'
  if (t === 2) return 'Tier 2 — Functional/Metabolic Specialist'
  return 'Tier 3 — General Metabolic'
}
