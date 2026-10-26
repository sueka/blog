import { type RefObject, useSyncExternalStore } from 'preact/compat'

function getFontSize(element: HTMLElement) {
  const pv = globalThis.getComputedStyle(element).getPropertyValue('font-size')

  if (!Number.isNaN(Number(pv))) {
    return Number(pv)
  }

  const result = pv.match(/(?<pixels>\d+(?:\.\d+)?|\.\d+)px/)
  const pixels = result?.groups?.['pixels']

  return Number(pixels)
}

export function useFontSize(fontSizeProvider: RefObject<HTMLElement>) {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener('resize', callback)
      return () => window.removeEventListener('resize', callback)
    },
    () => {
      if (fontSizeProvider.current) {
        return getFontSize(fontSizeProvider.current)
      }

      return 0
    },
  )
}
