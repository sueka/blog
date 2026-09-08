import { type Page, type Post, pages, posts } from '#velite'

export type Content = Page | Post

const contents: Content[] = [...pages, ...posts]

export const contentsByPermalink = new Map(
  contents.map((c) => [c.permalink, c]),
)
export const contentsBySourcePath = new Map(
  contents.map((c) => [c.sourcePath, c]),
)

export function findContentByPermalink(permalink: string): Content | undefined {
  return contentsByPermalink.get(permalink)
}

export function findContentBySourcePath(
  sourcePath: string,
): Content | undefined {
  return contentsBySourcePath.get(sourcePath)
}

export function findPageByPermalink(permalink: string): Page | undefined {
  const content = contentsByPermalink.get(permalink)
  return content?.type === 'Page' ? content : undefined
}

export function findPostByPermalink(permalink: string): Post | undefined {
  const content = contentsByPermalink.get(permalink)
  return content?.type === 'Post' ? content : undefined
}
