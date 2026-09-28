import type { PostEntry } from './generateAtomFeed'
import { renderPostContent } from './renderPostContent'

interface Post {
  title: string
  slug: string
  code: string
  date: string
  lastmod?: string | undefined
  permalink: string
}

export async function loadPosts(postsFilePath: string): Promise<PostEntry[]> {
  const posts: Post[] = (
    await import(postsFilePath, { with: { type: 'json' } })
  ).default

  return Promise.all(
    posts.map(async (p) => {
      const excerpt = await renderPostContent(p.code, {
        maxLength: 200,
        baseUrl: import.meta.url,
      })

      return {
        ...p,
        content: excerpt,
      }
    }),
  )
}
