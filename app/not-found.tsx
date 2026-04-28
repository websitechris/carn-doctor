import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">404</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Page not found</h1>
        <p className="mt-4 text-lg text-slate-600">
          The page you&apos;re looking for doesn&apos;t exist — it may have moved, or the URL may have a typo.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Home
          </Link>
          <Link
            href="/articles"
            className="inline-flex rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Articles
          </Link>
        </div>
      </div>
    </main>
  )
}
