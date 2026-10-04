import { useEffect } from 'preact/hooks'
import type { Image } from 'velite'
import { fail } from '~/lib/fail'
import classes from './Cover.module.css'

interface CoverProps {
  cover: Image

  /**
   * 本文が開始する要素の ref.
   */
  bodyStartRef?: React.RefObject<HTMLElement>
  snapDisabled?: boolean
}

/**
 * カバー画像.
 *
 * 本文が開始する位置に近づくとスクロールスナップする。{@link snapDisabled} で無効化。
 */
export const Cover: React.FC<CoverProps> = ({
  cover,
  bodyStartRef,
  snapDisabled,
}) => {
  useEffect(() => {
    const bodyStartElement = bodyStartRef?.current
    if (bodyStartElement == null) return

    const bodyStartClass = classes['BodyStart'] ?? fail()

    bodyStartElement.classList.add(bodyStartClass)

    return () => {
      bodyStartElement.classList.remove(bodyStartClass)
    }
  }, [bodyStartRef])

  useEffect(() => {
    if (snapDisabled) return

    const bodyStartElement = bodyStartRef?.current
    if (bodyStartElement == null) return

    const bodyStartClass = classes['SnapOk'] ?? fail()

    bodyStartElement.classList.add(bodyStartClass)

    return () => {
      bodyStartElement.classList.remove(bodyStartClass)
    }
  }, [bodyStartRef])

  return <img class={classes['Cover']} alt="" {...cover} />
}
