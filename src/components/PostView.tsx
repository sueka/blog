import { Suspense } from 'preact/compat'
import type { Post } from '#velite'
import { useTitle } from '~/hooks/useTitle'
import { MdxContent } from './MdxContent'
import { Center } from './util/Center'
import { InternalLink } from './util/InternalLink'

interface PostViewProps {
  post: Post
}

/**
 * Velite post オブジェクトをレンダリングする.
 */
export const PostView: React.FC<PostViewProps> = ({ post }) => {
  useTitle(post.title)

  return (
    <>
      <h1>{post.title}</h1>
      <Suspense fallback={<p>Loading…</p>}>
        <MdxContent
          code={post.code}
          components={{
            Center,
            InternalLink,
          }}
        />
      </Suspense>
    </>
  )
}
