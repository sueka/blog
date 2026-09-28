import { describe, expect, it } from 'vitest'
import type { Post } from '#velite'
import { renderPostContent } from './renderPostContent'

describe('renderPostContent', () => {
  it('renders MDX code to truncated HTML', async () => {
    const post: Post = {
      title: 'Hello',
      slug: 'hello',
      code: 'const{jsx:n}=arguments[0];function _createMdxContent(t){const e={p:"p",...t.components};return n(e.p,{children:"Hello, world!"})}return{default:function(t={}){const{wrapper:e}=t.components||{};return e?n(e,{...t,children:n(_createMdxContent,{...t})}):_createMdxContent(t)}};',
      date: '2026-09-29',
      type: 'Post',
      permalink: '/posts/hello',
      sourcePath: '/posts/hello.mdx',
    }

    const html = await renderPostContent(post.code, {
      maxLength: 200,
    })

    expect(html).toContain('Hello, world!')
  })
})
