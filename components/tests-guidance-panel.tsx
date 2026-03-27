const TEST_CARDS = [
  {
    name: 'CAC Heart Scan',
    why: 'The gold standard for cardiac risk',
    cost: 'Typically $75–$400 depending on region and facility.',
    href: '/labs',
  },
  {
    name: 'DEXA Scan',
    why: 'Measure visceral fat, not just weight',
    cost: 'Often $40–$150 for body composition; add-ons may apply.',
    href: '/labs',
  },
  {
    name: 'Fasting Insulin Panel',
    why: 'The test most GPs skip',
    cost: 'Roughly $15–$60 as an add-on to basic metabolic panels.',
    href: '/labs',
  },
  {
    name: 'Full Lipid NMR',
    why: 'Beyond basic cholesterol numbers',
    cost: 'Commonly $100–$250 when not insurance-covered.',
    href: '/labs',
  },
]

export function TestsGuidancePanel() {
  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">How to Get the Tests That Matter</h2>
        <p className="mt-2 max-w-3xl text-slate-600">The metabolic tests your doctor may not mention.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {TEST_CARDS.map((card) => (
          <article
            key={card.name}
            className="flex flex-col rounded-lg border border-slate-100 border-l-4 border-l-blue-600 bg-white p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-slate-800">{card.name}</h3>
            <p className="mt-2 text-sm font-medium text-slate-700">{card.why}</p>
            <p className="mt-3 text-sm text-slate-600">
              <span className="font-medium text-slate-800">Typical cost range: </span>
              {card.cost}
            </p>
            <a
              href={card.href}
              className="mt-4 inline-flex w-full justify-center rounded-md border border-blue-600 bg-white py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50"
            >
              Find This Test
            </a>
          </article>
        ))}
      </div>

      <div className="rounded-lg border border-blue-100 bg-white p-8 shadow-sm">
        <p className="text-center text-lg font-medium text-slate-800">Need help navigating these tests?</p>
        <div className="mt-4 flex justify-center">
          <a
            href="/labs"
            className="inline-flex rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Speak to an Advisor
          </a>
        </div>
      </div>
    </div>
  )
}
