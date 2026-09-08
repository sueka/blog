import { useContext, useEffect } from 'preact/hooks'
import { TitleContext } from '../contexts/TitleContext'

const SITE_NAME = 'blog.sueka.dev'

function resolveDocumentTitle(title: string): string {
  return title === SITE_NAME ? title : `${title} - ${SITE_NAME}`
}

/**
 * <title> を設定する.
 */
export function useTitle(title: string | null) {
  const titleSignal = useContext(TitleContext)
  const resolved = title != null ? resolveDocumentTitle(title) : null

  if (typeof window === 'undefined') {
    if (resolved != null) {
      titleSignal.value = resolved
    }
  }

  useEffect(() => {
    if (resolved == null) {
      return
    }

    const previous = document.title
    document.title = resolved

    return () => {
      document.title = previous
    }
  }, [resolved])
}
