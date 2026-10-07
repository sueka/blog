import { Suspense } from 'preact/compat'
import { useRef } from 'preact/hooks'
import type { Page } from '#velite'
import { useTitle } from '~/hooks/useTitle'
import { Cover } from './Cover'
import { MdxContent } from './MdxContent'
import { Center } from './util/Center'
import { InternalLink } from './util/InternalLink'
import classes from './PageView.module.css'

interface PageViewProps {
  page: Page
}

/**
 * Velite page オブジェクトをレンダリングする.
 */
export const PageView: React.FC<PageViewProps> = ({ page }) => {
  const bodyRef = useRef<HTMLDivElement>(null)

  useTitle(page.title)

  return (
    <main class={classes['PageView']}>
      {page.cover != null && (
        <Cover cover={page.cover} bodyStartRef={bodyRef} />
      )}
      <div ref={bodyRef} class={classes['TextBlock']}>
        <h1>{page.title}</h1>
        <Suspense fallback={<p>Loading…</p>}>
          <MdxContent
            code={page.code}
            components={{
              Center,
              InternalLink,
            }}
          />
        </Suspense>
      </div>
    </main>
  )
}
