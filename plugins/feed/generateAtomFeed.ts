import { Feed } from 'feed'

export interface PostEntry {
  title: string
  slug: string
  content: string
  date: string // ISO 8601 date
  lastmod?: string | undefined
  permalink: string
}

export interface FeedOptions {
  /**
   * 現在の配信元 URL.
   *
   * feed / entry の link に用いる。
   */
  publicUrl: string
  title: string
  author: {
    name: string
    url: string
  }

  /**
   * RFC 4151 tag URI の authorityName. {@link tagDate} 時点で割り当てられているドメイン名またはメールアドレス.
   *
   * NOTE: localhost は割り当てられないため、常に利用不可。
   */
  tagAuthority: string

  /**
   * RFC 4151 tag URI の date.
   */
  tagDate: string
}

function toTagUri(authority: string, date: string, specific: string): string {
  return `tag:${authority},${date}:${specific}`
}

export function generateAtomFeed(
  posts: readonly PostEntry[],
  { publicUrl, title, author, tagAuthority, tagDate }: FeedOptions,
): string {
  const feedId = toTagUri(tagAuthority, tagDate, 'feed')
  const siteUrl = publicUrl.replace(/\/+$/, '')
  const feedUrl = `${siteUrl}/feed.xml`
  const descPosts = posts.toSorted(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
  const latestPost = descPosts[0]
  const feedUpdated =
    latestPost != null
      ? new Date(latestPost.lastmod ?? latestPost.date)
      : new Date(0) // TODO

  const feed = new Feed({
    generator: false,
    title,
    id: feedId,
    link: siteUrl,
    feedLinks: {
      atom: feedUrl,
    },
    updated: feedUpdated,
    author: {
      name: author.name,
      link: author.url,
    },
  })

  for (const post of descPosts) {
    const entryUrl = new URL(post.permalink, siteUrl).toString()
    const entryId = toTagUri(tagAuthority, tagDate, `posts/${post.slug}`)
    const entryPublished = new Date(post.date)
    const entryUpdated = new Date(post.lastmod ?? post.date)

    feed.addItem({
      title: post.title,
      id: entryId,
      link: entryUrl,
      published: entryPublished,
      date: entryUpdated,
      ...(post.content != null ? { content: post.content } : {}),
    })
  }

  return feed.atom1()
}
