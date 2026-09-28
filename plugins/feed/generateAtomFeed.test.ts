import { describe, expect, it } from 'vitest'
import {
  type FeedOptions,
  generateAtomFeed,
  type PostEntry,
} from './generateAtomFeed.ts'

describe('generateAtomFeed', () => {
  const options: FeedOptions = {
    publicUrl: 'http://example.com',
    title: 'The Blog',
    author: {
      name: 'John Doe',
      url: 'http://john.example.com',
    },
    tagAuthority: 'example.com',
    tagDate: '2026-09-29',
  }

  it('generates valid Atom feed XML with entries sorted by date descending', () => {
    const posts: PostEntry[] = [
      {
        title: 'Older Post',
        slug: 'older',
        permalink: '/posts/older',
        date: '2026-09-01',
        content: '',
      },
      {
        title: 'Newer & Better <Post>',
        slug: 'newer',
        permalink: '/posts/newer',
        date: '2026-09-25',
        lastmod: '2026-09-26',
        content: '',
      },
    ]

    const xml = generateAtomFeed(posts, options)

    expect(xml).toContain('<?xml version="1.0" encoding="utf-8"?>')
    expect(xml).toContain('<feed xmlns="http://www.w3.org/2005/Atom">')
    expect(xml).toContain('<id>tag:example.com,2026-09-29:feed</id>')
    expect(xml).toContain('<title>The Blog</title>')
    expect(xml).toContain(
      '<link rel="self" href="http://example.com/feed.xml"/>',
    )
    expect(xml).toContain('<link rel="alternate" href="http://example.com/"/>')
    expect(xml).toContain('<name>John Doe</name>')
    expect(xml).toContain('<uri>http://john.example.com/</uri>')

    // feed updated should be newest item's lastmod / date
    expect(xml).toContain('<updated>2026-09-26T00:00:00.000Z</updated>')

    // Verify ordering: Newer post should come before Older post
    const newerIndex = xml.indexOf('Newer & Better <Post>')
    const olderIndex = xml.indexOf('Older Post')
    expect(newerIndex).toBeGreaterThan(-1)
    expect(olderIndex).toBeGreaterThan(-1)
    expect(newerIndex).toBeLessThan(olderIndex)

    // Verify entry fields
    expect(xml).toContain('<id>tag:example.com,2026-09-29:posts/newer</id>')
    expect(xml).toContain('<link href="http://example.com/posts/newer"/>')
    expect(xml).toContain('<published>2026-09-25T00:00:00.000Z</published>')
    expect(xml).toContain('<updated>2026-09-26T00:00:00.000Z</updated>')
  })

  it('includes HTML content in entry when provided', () => {
    const posts: PostEntry[] = [
      {
        title: 'Post with Content',
        slug: 'with-content',
        permalink: '/posts/with-content',
        date: '2026-09-25',
        content: '<p><strong>Hello</strong> world!</p>',
      },
    ]

    const xml = generateAtomFeed(posts, options)
    expect(xml).toContain(
      '<content type="html"><![CDATA[<p><strong>Hello</strong> world!</p>]]></content>',
    )
  })

  it('handles empty posts array gracefully', () => {
    const xml = generateAtomFeed([], options)
    expect(xml).toContain('<feed xmlns="http://www.w3.org/2005/Atom">')
    expect(xml).not.toContain('<entry>')
  })
})
