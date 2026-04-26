import Link from 'next/link'

export function NavBar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-gray-900 text-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm font-semibold tracking-tight sm:text-base">
          carnivore.doctor
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/#states" className="text-white/90 transition hover:text-white">
            Find a Doctor
          </Link>
          <Link href="/labs" className="text-white/90 transition hover:text-white">
            Labs &amp; Tests
          </Link>
        </nav>
      </div>
    </header>
  )
}
