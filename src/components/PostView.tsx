import { Suspense } from 'preact/compat'
import type { Post } from '#velite'
import { useTitle } from '~/hooks/useTitle'
import { FrontMatter } from './FrontMatter'
import { MdxContent } from './MdxContent'
import { Center } from './util/Center'
import { InternalLink } from './util/InternalLink'
import classes from './PageView.module.css'

interface PostViewProps {
  post: Post
}

/**
 * Velite post オブジェクトをレンダリングする.
 */
export const PostView: React.FC<PostViewProps> = ({ post }) => {
  useTitle(post.title)

  return (
    <main
      class={classes['PageView']}
      itemscope
      itemtype="https://schema.org/BlogPosting"
    >
      <div class={classes['TextBlock']}>
        <h1 itemprop="headline">{post.title}</h1>
        <FrontMatter date={post.date} />
        <Suspense fallback={<p>Loading…</p>}>
          <MdxContent
            code={post.code}
            components={{
              Center,
              InternalLink,
            }}
            props={{
              root: {
                itemprop: 'articleBody',
              },
            }}
          />
        </Suspense>
      </div>
    </main>
  )
}
