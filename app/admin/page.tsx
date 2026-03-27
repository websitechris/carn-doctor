'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { slugifyTitle } from '@/lib/slug'
import type { Article, ClinicalTest, Expert } from '@/lib/types'

type AdminTab = 'experts' | 'tests' | 'articles'

const US_STATE_OPTIONS = [
  '',
  'AL',
  'AK',
  'AZ',
  'AR',
  'CA',
  'CO',
  'CT',
  'DC',
  'DE',
  'FL',
  'GA',
  'HI',
  'ID',
  'IL',
  'IN',
  'IA',
  'KS',
  'KY',
  'LA',
  'ME',
  'MD',
  'MA',
  'MI',
  'MN',
  'MS',
  'MO',
  'MT',
  'NE',
  'NV',
  'NH',
  'NJ',
  'NM',
  'NY',
  'NC',
  'ND',
  'OH',
  'OK',
  'OR',
  'PA',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VA',
  'WA',
  'WV',
  'WI',
  'WY',
]

export default function AdminPage() {
  const [tab, setTab] = useState<AdminTab>('articles')
  const [experts, setExperts] = useState<Expert[]>([])
  const [tests, setTests] = useState<ClinicalTest[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)

  const [editingArticleId, setEditingArticleId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [slugFollowsTitle, setSlugFollowsTitle] = useState(true)
  const [stateCode, setStateCode] = useState('')
  const [category, setCategory] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [published, setPublished] = useState(false)
  const [storedPublishedAt, setStoredPublishedAt] = useState<string | null>(null)

  const loadExperts = useCallback(async () => {
    const { data, error } = await supabase.from('experts').select('*').eq('site_id', 'carnivore').order('name')
    if (error) throw error
    setExperts((data ?? []) as Expert[])
  }, [])

  const loadTests = useCallback(async () => {
    const { data, error } = await supabase.from('clinical_tests').select('*').order('id', { ascending: true })
    if (error) throw error
    setTests((data ?? []) as ClinicalTest[])
  }, [])

  const loadArticles = useCallback(async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('site_id', 'carnivore')
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('title', { ascending: true })

    if (error) throw error
    setArticles((data ?? []) as Article[])
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setMessage(null)
      try {
        if (tab === 'experts') await loadExperts()
        else if (tab === 'tests') await loadTests()
        else await loadArticles()
      } catch (e: unknown) {
        if (!cancelled) {
          const msg = e instanceof Error ? e.message : String(e)
          setMessage({ kind: 'err', text: msg })
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [tab, loadExperts, loadTests, loadArticles])

  function resetArticleForm() {
    setEditingArticleId(null)
    setTitle('')
    setSlug('')
    setSlugFollowsTitle(true)
    setStateCode('')
    setCategory('')
    setMetaDescription('')
    setExcerpt('')
    setContent('')
    setPublished(false)
    setStoredPublishedAt(null)
  }

  function fillArticleForm(a: Article) {
    setEditingArticleId(a.id)
    setTitle(a.title ?? '')
    setSlug(a.slug ?? '')
    setSlugFollowsTitle(false)
    setStateCode(a.state_code ?? '')
    setCategory(a.category ?? '')
    setMetaDescription(a.meta_description ?? '')
    setExcerpt(a.excerpt ?? '')
    setContent(a.content ?? '')
    setPublished(Boolean(a.published))
    setStoredPublishedAt(a.published_at ?? null)
  }

  function onTitleInput(value: string) {
    setTitle(value)
    if (slugFollowsTitle) setSlug(slugifyTitle(value))
  }

  function onSlugInput(value: string) {
    setSlug(value)
    setSlugFollowsTitle(false)
  }

  async function saveArticle() {
    setMessage(null)
    const s = slug.trim()
    const t = title.trim()
    if (!t || !s) {
      setMessage({ kind: 'err', text: 'Title and slug are required.' })
      return
    }

    const publishedAt =
      published ? (storedPublishedAt || new Date().toISOString()) : null

    const row = {
      site_id: 'carnivore' as const,
      slug: s,
      title: t,
      meta_description: metaDescription.trim() || null,
      excerpt: excerpt.trim() || null,
      content: content.trim() || null,
      category: category.trim() || null,
      state_code: stateCode.trim() || null,
      published,
      published_at: publishedAt,
    }

    try {
      if (editingArticleId) {
        const { error } = await supabase.from('articles').update(row).eq('id', editingArticleId)
        if (error) throw error
        setMessage({ kind: 'ok', text: 'Article updated.' })
      } else {
        const { error } = await supabase.from('articles').insert(row)
        if (error) throw error
        setMessage({ kind: 'ok', text: 'Article created.' })
        resetArticleForm()
      }
      await loadArticles()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      setMessage({ kind: 'err', text: msg })
    }
  }

  const tabBtn = (id: AdminTab, label: string) => (
    <button
      type="button"
      onClick={() => setTab(id)}
      className={`shrink-0 border-b-2 px-4 py-3 text-sm font-medium ${
        tab === id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
      }`}
    >
      {label}
    </button>
  )

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-slate-900">Carnivore.doctor admin</h1>
        <p className="mt-1 text-sm text-slate-600">Manage experts, clinical tests, and articles.</p>

        <nav className="mt-6 flex gap-2 overflow-x-auto border-b border-slate-200 bg-white/80">
          {tabBtn('experts', 'Experts')}
          {tabBtn('tests', 'Clinical tests')}
          {tabBtn('articles', 'Articles')}
        </nav>

        {message ? (
          <div
            className={`mt-4 rounded-md px-3 py-2 text-sm ${
              message.kind === 'ok' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}
          >
            {message.text}
          </div>
        ) : null}

        {loading ? <p className="mt-4 text-sm text-slate-500">Loading…</p> : null}

        {tab === 'experts' && !loading ? (
          <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-600">
                <tr>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">State</th>
                  <th className="px-3 py-2">Tier</th>
                  <th className="px-3 py-2">Category</th>
                </tr>
              </thead>
              <tbody>
                {experts.map((e) => (
                  <tr key={e.id} className="border-t border-slate-100">
                    <td className="px-3 py-2 font-medium">{e.name}</td>
                    <td className="px-3 py-2">{e.state_code ?? '—'}</td>
                    <td className="px-3 py-2">{e.tier ?? '—'}</td>
                    <td className="px-3 py-2">{e.category ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {experts.length === 0 ? <p className="p-4 text-sm text-slate-500">No experts found.</p> : null}
          </div>
        ) : null}

        {tab === 'tests' && !loading ? (
          <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-600">
                <tr>
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">Name</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((row) => (
                  <tr key={String(row.id)} className="border-t border-slate-100">
                    <td className="px-3 py-2 font-mono text-xs">{String(row.id)}</td>
                    <td className="px-3 py-2">{String(row.name ?? row.title ?? '—')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {tests.length === 0 ? <p className="p-4 text-sm text-slate-500">No clinical tests found.</p> : null}
          </div>
        ) : null}

        {tab === 'articles' && !loading ? (
          <div className="mt-6 grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2">
                  <h2 className="text-sm font-semibold text-slate-800">All articles</h2>
                  <button
                    type="button"
                    onClick={() => resetArticleForm()}
                    className="text-xs font-medium text-blue-600 hover:underline"
                  >
                    New
                  </button>
                </div>
                <ul className="max-h-[480px] divide-y divide-slate-100 overflow-y-auto text-sm">
                  {articles.map((a) => (
                    <li key={a.id}>
                      <button
                        type="button"
                        onClick={() => fillArticleForm(a)}
                        className={`flex w-full flex-col px-3 py-2 text-left hover:bg-slate-50 ${
                          editingArticleId === a.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <span className="font-medium text-slate-900 line-clamp-1">{a.title}</span>
                        <span className="text-xs text-slate-500">
                          {a.slug} · {a.published ? 'Published' : 'Draft'}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Insight links use categories: <code className="rounded bg-slate-200 px-1">abom</code>,{' '}
                <code className="rounded bg-slate-200 px-1">dpc</code>,{' '}
                <code className="rounded bg-slate-200 px-1">functional</code>,{' '}
                <code className="rounded bg-slate-200 px-1">telehealth</code>.
              </p>
            </div>

            <div className="space-y-4 lg:col-span-8">
              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-800">
                  {editingArticleId ? 'Edit article' : 'New article'}
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="sm:col-span-2 block text-sm">
                    <span className="font-medium text-slate-700">Title</span>
                    <input
                      value={title}
                      onChange={(e) => onTitleInput(e.target.value)}
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900"
                    />
                  </label>
                  <label className="sm:col-span-2 block text-sm">
                    <span className="font-medium text-slate-700">Slug</span>
                    <input
                      value={slug}
                      onChange={(e) => onSlugInput(e.target.value)}
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-sm text-slate-900"
                    />
                    <span className="mt-1 block text-xs text-slate-500">Auto-fills from title until you edit this field.</span>
                  </label>
                  <label className="block text-sm">
                    <span className="font-medium text-slate-700">State code</span>
                    <select
                      value={stateCode}
                      onChange={(e) => setStateCode(e.target.value)}
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900"
                    >
                      {US_STATE_OPTIONS.map((c) => (
                        <option key={c || 'none'} value={c}>
                          {c || '— None —'}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-sm">
                    <span className="font-medium text-slate-700">Category</span>
                    <input
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g. abom, dpc, functional, telehealth"
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900"
                    />
                  </label>
                  <label className="sm:col-span-2 block text-sm">
                    <span className="font-medium text-slate-700">Meta description</span>
                    <input
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900"
                    />
                  </label>
                  <label className="sm:col-span-2 block text-sm">
                    <span className="font-medium text-slate-700">Excerpt</span>
                    <textarea
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      rows={3}
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900"
                    />
                  </label>
                  <label className="sm:col-span-2 block text-sm">
                    <span className="font-medium text-slate-700">Content (HTML)</span>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={14}
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-xs text-slate-900"
                    />
                  </label>
                  <label className="flex items-center gap-2 text-sm sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600"
                    />
                    <span className="font-medium text-slate-700">Published</span>
                  </label>
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => void saveArticle()}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => resetArticleForm()}
                    className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Clear form
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  )
}
