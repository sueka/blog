import { run } from '@mdx-js/mdx'
import * as runtime from 'preact/jsx-runtime'
import renderToString from 'preact-render-to-string'
import truncate from 'truncate-html'

export interface RenderOptions {
  maxLength?: number
}

/**
 * MDX code をレンダリングし、フィード用に加工して返却する.
 */
export async function renderPostContent(
  code: string,
  { maxLength }: RenderOptions,
): Promise<string> {
  const { default: Component } = await run(code, runtime)

  const rawHtml = renderToString(
    <Component
      components={{
        Center: ({ children }) => <div>{children}</div>,
        InternalLink: ({ children }) => <span>{children}</span>,
      }}
    />,
  )

  return truncate(rawHtml, maxLength, { stripTags: true, ellipsis: '…' })
}
