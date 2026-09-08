import { run } from '@mdx-js/mdx'
import type { MDXContent } from 'mdx/types'
import * as runtime from 'preact/jsx-runtime'
import type { ResourceCache } from './resourceCache'

/**
 * MDX コンポーネント用のリソースキャッシュを生成する.
 */
export function createMdxCache(cache: ResourceCache<MDXContent>) {
  return {
    /**
     * MDX code からコンポーネントを取得する.
     */
    loadMdxComponent(code: string) {
      return cache.read(code, () =>
        run(code, { ...runtime, baseUrl: import.meta.url }).then(
          (mod) => mod.default,
        ),
      )
    },

    /**
     * 指定された MDX code に対応するキャッシュを削除する.
     */
    invalidateMdxComponent: cache.invalidate,
  }
}
