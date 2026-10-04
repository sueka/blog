import { Suspense } from 'preact/compat'
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
  useTitle(page.title)

  return (
    <div class={classes['PageView']}>
      {page.cover != null && <Cover cover={page.cover} />}
      <div class={classes['PageBody']}>
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
    </div>
  )
}
