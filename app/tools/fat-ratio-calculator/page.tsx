import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Fat-Ratio Calculator | Carnivore Doctor',
  description:
    'A small tool to estimate your target fat-to-protein energy ratio for therapeutic carbohydrate restriction. Coming soon.',
}

export default function FatRatioCalculatorPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-10 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Fat-Ratio Calculator</h1>
          <p className="mt-3 text-lg text-slate-600">
            Therapeutic carbohydrate restriction is partly about ratios — how much of your daily energy comes from fat versus protein. The right target depends on your goal: weight loss, blood-sugar stability, ketogenic adherence, or maintaining a steady low-carb baseline.
          </p>
          <p className="mt-4 text-base text-slate-600">
            The tool takes your goal, weight, and activity level and returns target macro ranges with a short explanation of the trade-offs each ratio implies.
          </p>
        </header>

        <section className="rounded-lg border border-slate-100 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Tool launching soon</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            The calculator is in development. Until it ships, our articles cover the underlying ratios — what changes when you raise fat, what protein floor to hold, and how the targets shift across goals.
          </p>
          <div className="mt-6">
            <Link
              href="/articles"
              className="inline-flex rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Read related articles
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
