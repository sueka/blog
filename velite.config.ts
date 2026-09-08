import { fail } from 'node:assert'
import path from 'node:path'
import rehypeHighlight from 'rehype-highlight'
import { defineConfig, s } from 'velite'

export default defineConfig({
  mdx: {
    rehypePlugins: [rehypeHighlight],
  },
  collections: {
    pages: {
      name: 'Page',
      pattern: '*.mdx',
      schema: s
        .object({
          title: s.string(),
          slug: s.slug().optional(),
          code: s.mdx(),
          noRoute: s.boolean().default(false),
        })
        .transform((data, ctx) => ({
          ...data,
          type: 'Page' as const,
          permalink: `/${data.slug ?? ''}`,
          sourcePath: path.join(
            '/',
            path
              .relative(ctx.meta.config.root, ctx.meta.history[0] ?? fail())
              .replaceAll(path.sep, '/'),
          ),
        })),
    },
    posts: {
      name: 'Post',
      pattern: 'posts/**/*.mdx',
      schema: s
        .object({
          title: s.string(),
          slug: s.slug('posts'),
          code: s.mdx(),
          date: s.isodate(),
          lastmod: s.isodate().optional(),
        })
        .transform((data, ctx) => ({
          ...data,
          type: 'Post' as const,
          permalink: `/posts/${data.slug}`,
          sourcePath: path.join(
            '/',
            path
              .relative(ctx.meta.config.root, ctx.meta.history[0] ?? fail())
              .replaceAll(path.sep, '/'),
          ),
        })),
    },
  },
})
