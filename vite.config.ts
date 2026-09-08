import path from 'node:path'
import preact from '@preact/preset-vite'
import velite from '@velite/plugin-vite'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'

export default defineConfig({
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
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
      '#velite': path.resolve(__dirname, '.velite'),
    },
  },
})
