import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | Carnivore Doctor',
  description: 'Our full privacy policy is being drafted. This page covers the short version in the meantime.',
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-10 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Privacy Policy</h1>
          <p className="mt-3 text-lg text-slate-600">
            A full privacy policy is being drafted. Until it&apos;s published, here&apos;s the short version of how this site handles information.
          </p>
        </header>

        <section className="space-y-6 rounded-lg border border-slate-100 bg-white p-8 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">What this site is</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Carnivore.Doctor is a directory of metabolic-health practitioners. We don&apos;t ask visitors to log in, and we don&apos;t run third-party tracking beyond standard server analytics that may be used to measure traffic and stability.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">Practitioner listings</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Practitioner information shown on the site is sourced from public listings and the practitioners&apos; own published websites. If you&apos;re a listed clinician and want a correction, contact us at the address below.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">Contact</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              For any data-related questions in the meantime, email{' '}
              <a href="mailto:hello@carnivore.doctor" className="font-medium text-blue-600 hover:underline">
                hello@carnivore.doctor
              </a>
              .
            </p>
          </div>
        </section>

        <p className="mt-6 text-sm text-slate-500">
          Full policy coming soon.{' '}
          <Link href="/" className="text-blue-600 hover:underline">
            Back to home
          </Link>
        </p>
      </div>
    </main>
  )
}
