import { fail } from 'node:assert'
import { mergeConfig, type Plugin } from 'vite'
import { generateAtomFeed } from './generateAtomFeed.ts'
import { loadPosts } from './loadPosts.ts'

export interface FeedPluginOptions {
  postsFilePath: string
  feed: {
    publicUrl?: string
    title: string
    author: {
      name: string
      url: string
    }
    tagAuthority: string
    tagDate: string
  }
}

/**
 * Post オブジェクトを収集して Atom フィードを生成する Vite プラグイン.
 */
export function feed({
  postsFilePath,
  feed: feedOptions,
}: FeedPluginOptions): Plugin {
  let resolvedPublicUrl: string

  return {
    name: 'vite-plugin-feed',
    apply: 'build',
    config(config) {
      return mergeConfig(config, {
        optimizeDeps: {
          exclude: [postsFilePath],
        },
      })
    },
    configResolved(config) {
      if (config.command === 'build') {
        resolvedPublicUrl = feedOptions.publicUrl ?? fail()
      }
    },
    configureServer(server) {
      // resolvedUrls は開発サーバーが listen を開始した後に設定される。
      server.httpServer?.once('listening', () => {
        resolvedPublicUrl =
          feedOptions.publicUrl ?? server.resolvedUrls?.local[0] ?? fail()
      })
    },
    async generateBundle() {
      const posts = await loadPosts(postsFilePath)
      const xml = generateAtomFeed(posts, {
        ...feedOptions,
        publicUrl: resolvedPublicUrl,
      })

      this.emitFile({
        type: 'asset',
        fileName: 'feed.xml',
        source: xml,
      })
    },
    transformIndexHtml() {
      return [
        {
          tag: 'link',
          attrs: {
            href: '/feed.xml',
            rel: 'alternate',
            type: 'application/atom+xml',
            title: feedOptions.title,
          },
          injectTo: 'head',
        },
      ]
    },
  }
}
