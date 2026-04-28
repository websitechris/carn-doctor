import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Labs & Tests | Carnivore Doctor',
  description:
    'A guide to the metabolic-health labs and imaging that put real numbers behind your blood-sugar, lipid, and body-composition picture.',
}

export default function LabsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-10 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Labs &amp; Tests</h1>
          <p className="mt-3 text-lg text-slate-600">
            Metabolic health depends on tests your standard physical often skips — fasting insulin, NMR lipid panels, CAC scans, DEXA, and advanced markers that put real numbers behind the conversation.
          </p>
          <p className="mt-4 text-base text-slate-600">
            We&apos;re building a curated guide to which tests matter, when to ask for them, and how to read the results. Each entry will explain what it measures, why it changes the picture, and how to talk about it with your clinician.
          </p>
        </header>

        <section className="rounded-lg border border-slate-100 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">More coming soon</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            We&apos;re finalising the first set of test pages. In the meantime, the practitioners listed in our state directories routinely order these panels.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/#states"
              className="inline-flex rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Browse by state →
            </Link>
            <Link
              href="/articles"
              className="inline-flex rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Read articles
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
