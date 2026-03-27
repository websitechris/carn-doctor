import type { Metadata } from 'next'
import Link from 'next/link'
import { getArticlesByCategory, getPublishedArticlesForSite } from '@/lib/api'
import { formatArticleDate } from '@/lib/format-date'
import type { Article } from '@/lib/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Articles | Carnivore Doctor',
  description: 'Metabolic health, clinical context, and practical guidance.',
}

function groupByCategory(articles: Article[]): Map<string, Article[]> {
  const m = new Map<string, Article[]>()
  for (const a of articles) {
    const key = a.category?.trim() || 'General'
    const list = m.get(key) ?? []
    list.push(a)
    m.set(key, list)
  }
  return m
}

type PageProps = { searchParams: Promise<{ category?: string }> }

export default async function ArticlesIndexPage({ searchParams }: PageProps) {
  const { category: categoryFilter } = await searchParams
  const articles = categoryFilter?.trim()
    ? await getArticlesByCategory(categoryFilter.trim())
    : await getPublishedArticlesForSite()

  const grouped = groupByCategory(articles)
  const sectionKeys = Array.from(grouped.keys()).sort((a, b) => a.localeCompare(b))

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-12 max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Articles</h1>
          <p className="mt-3 text-lg text-slate-600">
            Evidence-aligned commentary on metabolic health, clinical models, and navigating care.
          </p>
          {categoryFilter?.trim() ? (
            <p className="mt-4 text-sm text-slate-600">
              Filtered by category: <strong>{categoryFilter}</strong>.{' '}
              <Link href="/articles" className="font-medium text-blue-600 hover:underline">
                Clear filter
              </Link>
            </p>
          ) : null}
        </header>

        {articles.length === 0 ? (
          <p className="rounded-lg border border-slate-100 bg-white p-8 text-center text-slate-600 shadow-sm">
            No published articles yet.
          </p>
        ) : (
          <div className="space-y-14">
            {sectionKeys.map((cat) => (
              <section key={cat}>
                <h2 className="mb-6 border-b border-slate-200 pb-2 text-xl font-semibold text-slate-900">{cat}</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {grouped.get(cat)!.map((article) => (
                    <article
                      key={article.id}
                      className="flex flex-col rounded-lg border border-slate-100 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow"
                    >
                      {article.category?.trim() ? (
                        <span className="mb-2 w-fit rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                          {article.category}
                        </span>
                      ) : null}
                      <h3 className="text-lg font-bold text-slate-900 line-clamp-2">{article.title}</h3>
                      {article.excerpt?.trim() ? (
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">
                          {article.excerpt}
                        </p>
                      ) : null}
                      <div className="mt-4 flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
                        <time className="text-xs text-slate-500">{formatArticleDate(article.published_at)}</time>
                        <Link
                          href={`/articles/${article.slug}`}
                          className="shrink-0 text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                          Read article →
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
