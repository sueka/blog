import { signal } from '@preact/signals'
import { StrictMode } from 'preact/compat'
import { hydrate, prerender as ssr } from 'preact-iso'
import type { PrerenderResult } from 'vite-prerender-plugin'
import { pages, posts } from '#velite'
import { App } from './components/App.tsx'
import { TitleContext } from './contexts/TitleContext.ts'
import { fail } from './lib/fail.ts'

import './styles/main.css'

if (typeof window !== 'undefined') {
  hydrate(
    <StrictMode>
      <App />
    </StrictMode>,
    document.getElementById('app') ?? fail(),
  )
}

const permalinksToRoute = new Set([
  ...pages.filter((p) => !p.noRoute).map((p) => p.permalink),
  ...posts.map((p) => p.permalink),
])

export async function prerender(): Promise<PrerenderResult> {
  const titleSignal = signal('')

  const prerendered = await ssr(
    <StrictMode>
      <TitleContext.Provider value={titleSignal}>
        <App />
      </TitleContext.Provider>
    </StrictMode>,
  )

  const title = titleSignal.value

  return {
    ...prerendered,
    links: permalinksToRoute,
    head: {
      title,
    },
  }
}
