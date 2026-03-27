import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getArticleBySlug, getDirectorySlugFromStateCode } from '@/lib/api'
import { formatArticleDate } from '@/lib/format-date'

export const dynamic = 'force-dynamic'

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return { title: 'Article' }
  return {
    title: `${article.title} | Carnivore Doctor`,
    description: article.meta_description ?? article.excerpt ?? undefined,
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) notFound()

  const dirSlug = getDirectorySlugFromStateCode(article.state_code)
  const categoryLabel = article.category?.trim() || 'Articles'
  const categoryHref = article.category?.trim()
    ? `/articles?category=${encodeURIComponent(article.category.trim())}`
    : '/articles'

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <nav className="mb-8 text-sm text-slate-600" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-blue-600">
                Home
              </Link>
            </li>
            <li aria-hidden="true">→</li>
            <li>
              <Link href="/articles" className="hover:text-blue-600">
                Articles
              </Link>
            </li>
            <li aria-hidden="true">→</li>
            <li>
              <Link href={categoryHref} className="hover:text-blue-600">
                {categoryLabel}
              </Link>
            </li>
            <li aria-hidden="true">→</li>
            <li className="font-medium text-slate-800 line-clamp-1">{article.title}</li>
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <article className="lg:col-span-8">
            <header className="mb-8 border-b border-slate-200 pb-8">
              {article.category?.trim() ? (
                <span className="mb-3 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                  {article.category}
                </span>
              ) : null}
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                {article.title}
              </h1>
              {article.published_at ? (
                <p className="mt-3 text-sm text-slate-500">
                  {formatArticleDate(article.published_at, 'long')}
                </p>
              ) : null}
              {article.meta_description?.trim() ? (
                <p className="mt-6 text-lg font-medium leading-relaxed text-slate-600">
                  {article.meta_description}
                </p>
              ) : null}
            </header>

            {article.content?.trim() ? (
              <div
                className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-a:text-blue-600"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            ) : (
              <p className="text-slate-600">No article body yet.</p>
            )}

            <div className="mt-12 rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Find a Metabolic Health Practitioner Near You</h2>
              <p className="mt-2 text-sm text-slate-600">
                Search verified clinicians by state and filter by tier, telehealth, and more.
              </p>
              <Link
                href="/directory/alabama"
                className="mt-6 inline-flex rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Browse directory
              </Link>
            </div>
          </article>

          <aside className="lg:col-span-4">
            <div className="space-y-8 lg:sticky lg:top-24">
              <section className="rounded-lg border border-slate-100 bg-white p-6 shadow-sm">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-800">Related tests</h2>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link
                      href="/labs"
                      className="block rounded-md border border-slate-100 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-blue-50/50"
                    >
                      <span className="font-medium text-slate-900">Metabolic lab panels</span>
                      <span className="mt-1 block text-xs text-slate-600">Insulin, NMR lipids, and markers your GP may not order.</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/labs"
                      className="block rounded-md border border-slate-100 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-blue-50/50"
                    >
                      <span className="font-medium text-slate-900">Imaging &amp; advanced screening</span>
                      <span className="mt-1 block text-xs text-slate-600">CAC, DEXA, and other tools to quantify real risk.</span>
                    </Link>
                  </li>
                </ul>
              </section>

              {dirSlug ? (
                <section className="rounded-lg border border-slate-100 bg-white p-6 shadow-sm">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-800">Find a local doctor</h2>
                  <p className="mt-2 text-sm text-slate-600">
                    See verified practitioners tied to this region in our directory.
                  </p>
                  <Link
                    href={`/directory/${dirSlug}`}
                    className="mt-4 inline-flex w-full justify-center rounded-md bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    Open state directory
                  </Link>
                </section>
              ) : null}
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
