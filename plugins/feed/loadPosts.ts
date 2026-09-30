import type { PostEntry } from './generateAtomFeed.ts'
import { renderPostContent } from './renderPostContent.ts'

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
      })

      return {
        ...p,
        content: excerpt,
      }
    }),
  )
}
