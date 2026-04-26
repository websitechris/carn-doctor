'use client'

import { useState } from 'react'
import type { Article, Expert, StateContent } from '@/lib/types'
import { PractitionerDirectory } from '@/components/practitioner-directory'
import { StateOverviewPanel } from '@/components/state-overview-panel'
import { StateInsightsPanel } from '@/components/state-insights-panel'
import { NationalExpertsPanel } from '@/components/national-experts-panel'
import { TestsGuidancePanel } from '@/components/tests-guidance-panel'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'directory', label: 'Directory' },
  { id: 'insights', label: 'Insights' },
  { id: 'national', label: 'National Experts' },
  { id: 'tests', label: 'Tests & Guidance' },
] as const

export type StateTabId = (typeof TABS)[number]['id']

type Props = {
  stateContent: StateContent | null
  stateName: string
  practitioners: Expert[]
  nationalExperts: Expert[]
  stateArticles: Article[]
}

export function StateTabs({ stateContent, stateName, practitioners, nationalExperts, stateArticles }: Props) {
  const [active, setActive] = useState<StateTabId>('overview')

  return (
    <div>
      <nav
        className="sticky top-0 z-40 -mx-4 border-b border-slate-200 bg-slate-50/95 px-4 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 [scrollbar-width:thin]"
        aria-label="Directory sections"
      >
        <div className="flex gap-1 overflow-x-auto pb-px">
          {TABS.map((tab) => {
            const isActive = active === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActive(tab.id)}
                className={`shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </nav>

      <div className="pt-8">
        {active === 'overview' && (
          <StateOverviewPanel stateContent={stateContent} stateName={stateName} practitioners={practitioners} />
        )}
        {active === 'directory' && (
          <PractitionerDirectory practitioners={practitioners} stateName={stateName} />
        )}
        {active === 'insights' && (
          <StateInsightsPanel
            stateName={stateName}
            practitioners={practitioners}
            stateArticles={stateArticles}
          />
        )}
        {active === 'national' && <NationalExpertsPanel experts={nationalExperts} />}
        {active === 'tests' && <TestsGuidancePanel />}
      </div>
    </div>
  )
}
