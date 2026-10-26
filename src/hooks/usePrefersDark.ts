import { useSyncExternalStore } from 'preact/compat'

const QUERY = '(prefers-color-scheme: dark)'

export function usePrefersDark() {
  return useSyncExternalStore(
    (callback) => {
      if (typeof window === 'undefined') {
        return () => {}
      }

      const mql = window.matchMedia(QUERY)

      mql.addEventListener('change', callback)

      return () => {
        mql.removeEventListener('change', callback)
      }
    },
    () => {
      if (typeof window === 'undefined') {
        return false
      }

      return window.matchMedia(QUERY).matches
    },
  )
}
