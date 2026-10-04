import { useEffect, useRef } from 'preact/hooks'
import type { Image } from 'velite'
import { useKeymap } from '~/hooks/useKeymap'
import { fail } from '~/lib/fail'
import { isInViewport } from '~/lib/isInViewport'
import classes from './Cover.module.css'

interface CoverProps {
  cover: Image

  /**
   * 本文が開始する要素の ref.
   */
  bodyStartRef?: React.RefObject<HTMLElement>
  snapDisabled?: boolean
  skipDisabled?: boolean
}

/**
 * カバー画像.
 *
 * 本文が開始する位置に近づくとスクロールスナップする。{@link snapDisabled} で無効化。
 * カバー画像が見えているときに下矢印キーを押すと本文が開始する位置に移動する。{@link skipDisabled} で無効化。
 */
export const Cover: React.FC<CoverProps> = ({
  cover,
  bodyStartRef,
  snapDisabled,
  skipDisabled,
}) => {
  const ref = useRef<HTMLImageElement>(null)

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

  useKeymap({ key: 'ArrowDown' }, (event) => {
    if (skipDisabled) return

    event.preventDefault()

    const coverImageElement = ref.current
    if (coverImageElement == null) return

    if (isInViewport(coverImageElement)) {
      bodyStartRef?.current?.scrollIntoView({ behavior: 'smooth' })
    }
  })

  return <img ref={ref} class={classes['Cover']} alt="" {...cover} />
}
