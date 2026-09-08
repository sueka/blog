type ResourceCacheEntry<T> =
  | { status: 'Pending'; settled: Promise<void> }
  | { status: 'Success'; value: T }
  | { status: 'Failed'; error: unknown }

export type ResourceCache<T> = ReturnType<typeof createResourceCache<T>>

/**
 * Suspense 互換のリソースキャッシュを生成する.
 */
export function createResourceCache<T>() {
  const cache = new Map<string, ResourceCacheEntry<T>>()

  return {
    /**
     * 指定されたキーに対応するリソースを取得する.
     *
     * @throws {Promise<void>} リソース読み込み中の場合
     * @throws {unknown} リソース読み込みに失敗した場合
     */
    read(key: string, loader: () => Promise<T>): T {
      const entry = cache.get(key)

      if (entry == null) {
        const { promise: settled, resolve } = Promise.withResolvers<void>()
        cache.set(key, { status: 'Pending', settled })

        loader().then(
          (value) => {
            cache.set(key, { status: 'Success', value })
            resolve()
          },
          (error) => {
            cache.set(key, { status: 'Failed', error })
            resolve()
          },
        )

        throw settled
      }

      switch (entry.status) {
        case 'Pending':
          throw entry.settled
        case 'Failed':
          throw entry.error
        case 'Success':
          return entry.value
      }
    },

    /**
     * 指定されたキーのキャッシュを削除する.
     */
    invalidate(key: string) {
      cache.delete(key)
    },
  }
}
