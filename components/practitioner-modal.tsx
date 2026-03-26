'use client'

import { useEffect } from 'react'
import type { Expert } from '@/lib/types'
import { getTierLabel } from '@/components/practitioner-tier'

type Props = {
  expert: Expert | null
  onClose: () => void
}

export function PractitionerModal({ expert, onClose }: Props) {
  useEffect(() => {
    if (!expert) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [expert, onClose])

  if (!expert) return null

  const mapsUrl = expert.address?.trim()
    ? `https://maps.google.com/?q=${encodeURIComponent(expert.address.trim())}`
    : null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="practitioner-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl md:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          aria-label="Close"
        >
          <span className="text-2xl leading-none">&times;</span>
        </button>
        <div className="pr-8">
          <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
            {getTierLabel(expert.tier)}
          </span>
          <h2 id="practitioner-modal-title" className="mt-3 text-2xl font-bold text-slate-800">
            {expert.name}
          </h2>
          {expert.credentials?.trim() ? (
            <p className="mt-1 text-lg font-semibold text-slate-800">{expert.credentials}</p>
          ) : null}
          {expert.practice_name?.trim() || expert.city?.trim() ? (
            <p className="mt-3 text-sm text-gray-700">
              {[expert.practice_name?.trim(), expert.city?.trim()].filter(Boolean).join(' · ')}
            </p>
          ) : null}
          {expert.evidence_summary?.trim() ? (
            <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm italic text-slate-700">
              {expert.evidence_summary}
            </div>
          ) : null}
          {expert.flags?.trim() ? (
            <p className="mt-4 text-sm text-slate-600">{expert.flags}</p>
          ) : null}
          {expert.phone?.trim() ? (
            <p className="mt-4 text-sm">
              <a href={`tel:${expert.phone.replace(/\s/g, '')}`} className="font-medium text-blue-600 hover:underline">
                {expert.phone}
              </a>
            </p>
          ) : null}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {expert.website?.trim() ? (
              <a
                href={expert.website.startsWith('http') ? expert.website : `https://${expert.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 justify-center rounded-md bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700"
              >
                Visit Website
              </a>
            ) : null}
            {mapsUrl ? (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 justify-center rounded-md border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
              >
                Get Directions
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
