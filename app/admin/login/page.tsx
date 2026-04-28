import { loginAction } from './actions'

type SearchParams = Promise<{ error?: string }>

export default async function AdminLoginPage({ searchParams }: { searchParams: SearchParams }) {
  const { error } = await searchParams

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form
        action={loginAction}
        className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h1 className="text-lg font-semibold text-slate-900">Admin login</h1>
        <p className="mt-1 text-sm text-slate-600">Enter the admin password to continue.</p>

        <label className="mt-5 block text-sm">
          <span className="font-medium text-slate-700">Password</span>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
            autoFocus
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900"
          />
        </label>

        {error ? (
          <p className="mt-3 text-sm text-red-700">Incorrect password.</p>
        ) : null}

        <button
          type="submit"
          className="mt-5 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Sign in
        </button>
      </form>
    </main>
  )
}
