import { fail } from 'node:assert'
import path from 'node:path'
import rehypeHighlight from 'rehype-highlight'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import { defineConfig, s } from 'velite'

const rehypeKatexPerFile: typeof rehypeKatex =
  (options = {}) =>
  (tree, file) =>
    rehypeKatex({
      ...options,
      macros: { ...options?.macros },
    })(tree, file)

export default defineConfig({
  mdx: {
    rehypePlugins: [rehypeHighlight, rehypeKatexPerFile],
    remarkPlugins: [remarkMath],
  },
  collections: {
    pages: {
      name: 'Page',
      pattern: '*.mdx',
      schema: s
        .object({
          cover: s.image().optional(),
          title: s.string(),
          slug: s.slug().optional(),
          code: s.mdx(),
          noRoute: s.boolean().default(false),
        })
        .transform((data, ctx) => ({
          ...data,
          type: 'Page' as const,
          permalink: `/${data.slug ?? ''}`,
          sourcePath: path
            .join(
              '/',
              path.relative(
                ctx.meta.config.root,
                ctx.meta.history[0] ?? fail(),
              ),
            )
            .replaceAll(path.sep, '/'),
        })),
    },
    posts: {
      name: 'Post',
      pattern: 'posts/**/*.mdx',
      schema: s
        .object({
          title: s.string(),
          slug: s.slug('posts'), // NOTE: tag URI の specific として利用されるため、taggingEntity を通して一意。
          code: s.mdx(),
          date: s.string().date(),
          lastmod: s.string().date().optional(),
        })
        .transform((data, ctx) => ({
          ...data,
          type: 'Post' as const,
          permalink: `/posts/${data.slug}`,
          sourcePath: path
            .join(
              '/',
              path.relative(
                ctx.meta.config.root,
                ctx.meta.history[0] ?? fail(),
              ),
            )
            .replaceAll(path.sep, '/'),
        })),
    },
  },
})
