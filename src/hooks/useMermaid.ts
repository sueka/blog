import mermaid from 'mermaid'
import { useEffect } from 'preact/hooks'
import { usePrefersDark } from './usePrefersDark'

type ScheduleFrame = (callback: FrameRequestCallback) => void

/**
 * (source, id) の WeakMap.
 */
const sources = new WeakMap<Element, readonly [string, string]>()
let nextId = 0

function getSourceAndId(pre: Element): readonly [string, string] {
  const entry = sources.get(pre)

  if (entry == null) {
    const newEntry = [pre.textContent, `mermaid-${nextId++}`] as const
    sources.set(pre, newEntry)
    return newEntry
  }

  return entry
}

function scheduleRender(
  pre: Element,
  signal: AbortSignal,
  prefersDark: boolean,
  pres: Iterable<Element>,
  rendering: WeakSet<Element>,
  pending: WeakSet<Element>,
  scheduleFrame: ScheduleFrame,
) {
  if (pending.has(pre)) {
    return
  }

  pending.add(pre)

  if (rendering.has(pre)) {
    return
  }

  scheduleFrame(() => {
    if (pending.has(pre)) {
      pending.delete(pre)
      renderPre(
        pre,
        signal,
        prefersDark,
        pres,
        rendering,
        pending,
        scheduleFrame,
      )
    }
  })
}

function finishRender(
  pre: Element,
  signal: AbortSignal,
  prefersDark: boolean,
  pres: Iterable<Element>,
  rendering: WeakSet<Element>,
  pending: WeakSet<Element>,
  scheduleFrame: ScheduleFrame,
) {
  rendering.delete(pre)

  if (!signal.aborted && pending.has(pre)) {
    pending.delete(pre)
    scheduleRender(
      pre,
      signal,
      prefersDark,
      pres,
      rendering,
      pending,
      scheduleFrame,
    )
  }
}

function renderPre(
  pre: Element,
  signal: AbortSignal,
  prefersDark: boolean,
  pres: Iterable<Element>,
  rendering: WeakSet<Element>,
  pending: WeakSet<Element>,
  scheduleFrame: ScheduleFrame,
) {
  if (signal.aborted) {
    return
  }

  if (rendering.has(pre)) {
    pending.add(pre)
    return
  }

  rendering.add(pre)

  const [source, id] = getSourceAndId(pre)

  ;(async () => {
    const { svg, bindFunctions } = await mermaid.render(
      `${id}-${prefersDark ? 'dark' : 'light'}`,
      source,
      pre,
    )

    if (!signal.aborted) {
      pre.innerHTML = svg
      bindFunctions?.(pre)
    }
  })().then(
    () =>
      finishRender(
        pre,
        signal,
        prefersDark,
        pres,
        rendering,
        pending,
        scheduleFrame,
      ),
    (error) => {
      if (!signal.aborted) {
        console.error('Failed to render Mermaid diagram:', error)
      }

      finishRender(
        pre,
        signal,
        prefersDark,
        pres,
        rendering,
        pending,
        scheduleFrame,
      )
    },
  )
}

export function useMermaid() {
  const prefersDark = usePrefersDark()

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    let frame: number | null = null

    const pres = document.querySelectorAll('pre.mermaid')

    const widths = new WeakMap<Element, number>()
    const rendering = new WeakSet<Element>()
    const pending = new WeakSet<Element>()

    mermaid.initialize({
      startOnLoad: false,
      theme: prefersDark ? 'neo-dark' : 'neo',
      themeVariables: {
        fontSize: 'unset',
      },
    })

    const callbacks: FrameRequestCallback[] = []

    const scheduleFrame: ScheduleFrame = (callback) => {
      // enqueue
      callbacks.push(callback)

      if (frame != null) {
        return
      }

      frame = requestAnimationFrame((timestamp) => {
        frame = null

        // dequeue all
        const current = callbacks.splice(0)

        for (const callback of current) {
          callback(timestamp)
        }
      })
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const pre = entry.target
        const width = entry.contentRect.width
        const previousWidth = widths.get(pre)

        widths.set(pre, width)

        if (width <= 0) continue

        if (previousWidth == null || Math.abs(width - previousWidth) >= 1) {
          scheduleRender(
            pre,
            signal,
            prefersDark,
            pres,
            rendering,
            pending,
            scheduleFrame,
          )
        }
      }
    })

    ;(async () => {
      await document.fonts.ready

      if (signal.aborted) {
        return
      }

      for (const pre of pres) {
        observer.observe(pre)
      }
    })()

    return () => {
      controller.abort()
      observer.disconnect()

      if (frame != null) {
        cancelAnimationFrame(frame)
        frame = null
      }
    }
  }, [prefersDark])
}
