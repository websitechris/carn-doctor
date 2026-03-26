import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getExpertsByState, getStateCodeFromSlug, getStateContent } from '@/lib/api'
import { PractitionerDirectory } from '@/components/practitioner-directory'

export const dynamic = 'force-dynamic'

function ResearchSection({ title, html }: { title: string; html: string | null }) {
  if (!html?.trim()) return null
  return (
    <section className="rounded-lg border border-slate-100 border-l-4 border-l-blue-600 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-slate-800">{title}</h2>
      <div
        className="text-slate-700 leading-relaxed [&_a]:text-blue-600 [&_a]:underline"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </section>
  )
}

type PageProps = { params: Promise<{ state: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state: slug } = await params
  const content = await getStateContent(slug)
  if (!content) return { title: 'Directory' }
  return {
    title: `${content.state_name} — Metabolic Health Directory | Carnivore Doctor`,
    description: content.meta_description ?? undefined,
  }
}

export default async function StateDirectoryPage({ params }: PageProps) {
  const { state: slug } = await params

  const stateContent = await getStateContent(slug)
  if (!stateContent) notFound()

  const stateCode = getStateCodeFromSlug(slug)
  if (!stateCode) notFound()

  const practitioners = await getExpertsByState(stateCode)

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-slate-800 sm:text-5xl">
            {stateContent.state_name}
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Verified Metabolic Health &amp; Carnivore-Friendly Practitioners
          </p>
          <div
            className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950 shadow-sm"
            role="note"
          >
            Due to medical board guidelines, most practitioners cannot publicly endorse the carnivore diet.
            These providers specialise in therapeutic carbohydrate restriction, functional medicine, and
            metabolic health approaches that align with animal-based nutrition.
          </div>
        </header>

        <div className="space-y-8">
          <ResearchSection title="Clinical Overview" html={stateContent.executive_summary} />
          <ResearchSection title="Academic Institutions" html={stateContent.academic_vanguard} />
          <ResearchSection title="Private Specialists" html={stateContent.private_sector_analysis} />
          <ResearchSection title="Functional Medicine" html={stateContent.functional_landscape} />
          <ResearchSection title="Direct Primary Care" html={stateContent.dpc_revolution} />
        </div>

        <PractitionerDirectory practitioners={practitioners} stateName={stateContent.state_name} />
      </div>
    </main>
  )
}
