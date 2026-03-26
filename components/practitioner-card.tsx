import type { Expert } from '@/lib/types'
import { getTierBorderClass, getTierLabel } from '@/components/practitioner-tier'

type Props = {
  expert: Expert
  onViewDetails: (expert: Expert) => void
}

export function PractitionerCard({ expert, onViewDetails }: Props) {
  const cityLine = expert.city?.trim() || expert.primary_focus?.trim() || ''

  return (
    <article
      className={`flex flex-col rounded-lg border border-slate-100 bg-white shadow-sm border-l-4 ${getTierBorderClass(expert.tier)} p-5`}
    >
      <span className="mb-3 inline-flex w-fit rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
        {getTierLabel(expert.tier)}
      </span>
      <h3 className="text-lg font-bold text-slate-800">
        {expert.name}
        {expert.credentials ? (
          <span className="mt-1 block text-base font-bold text-slate-800">{expert.credentials}</span>
        ) : null}
      </h3>
      {expert.practice_name?.trim() ? (
        <p className="mt-1 text-sm font-medium text-gray-700">{expert.practice_name}</p>
      ) : null}
      {cityLine ? <p className="mt-1 text-xs text-gray-500">{cityLine}</p> : null}
      {expert.flags?.trim() ? (
        <p className="mt-2 text-xs text-slate-600 line-clamp-3">{expert.flags}</p>
      ) : null}
      <button
        type="button"
        onClick={() => onViewDetails(expert)}
        className="mt-4 w-full rounded-md bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
      >
        View Details
      </button>
    </article>
  )
}
