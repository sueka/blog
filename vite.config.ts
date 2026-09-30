import { fail } from 'node:assert'
import path from 'node:path'
import preact from '@preact/preset-vite'
import velite from '@velite/plugin-vite'
import { defineConfig, loadEnv } from 'vite'
import checker from 'vite-plugin-checker'
import siteMeta from './meta/site.json' with { type: 'json' }
import { feed } from './plugins/feed/vitePlugin.ts'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [
      preact({
        prerender: {
          enabled: true,
          renderTarget: '#app',
          additionalPrerenderRoutes: ['/404.html'],
          previewMiddlewareEnabled: true,
        },
      }),
      velite(),
      checker({}),
      feed({
        postsFilePath: path.resolve(import.meta.dirname, '.velite/posts.json'),
        feed: {
          ...siteMeta,
          title: siteMeta.name,
          publicUrl: env['VITE_PUBLIC_URL'],
        },
      }),
    ],
    resolve: {
      alias: {
        '~': path.resolve(import.meta.dirname, 'src'),
        '#velite': path.resolve(import.meta.dirname, '.velite'),
      },
    },
    define: {
      __SITE_NAME__: JSON.stringify(siteMeta.name),
    },
  }
})
