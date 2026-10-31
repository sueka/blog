import mermaid from 'mermaid'
import { useEffect } from 'preact/hooks'
import { usePrefersDark } from './usePrefersDark'

type ScheduleFrame = (callback: FrameRequestCallback) => void

interface RenderState {
  pres: Iterable<Element>
  rendering: WeakSet<Element>
  pending: WeakSet<Element>
}

interface RenderContext {
  signal: AbortSignal
  prefersDark: boolean
}

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

/**
 * {@link pre} の描画要求を登録し、必要に応じて、描画要求を処理する RAF を予約する.
 */
function scheduleRender(
  pre: Element,
  context: RenderContext,
  state: RenderState,
  requestBaf: ScheduleFrame,
) {
  // すでに描画要求が登録されている場合は何もしない。
  if (state.pending.has(pre)) {
    return
  }

  state.pending.add(pre)

  // すでに描画中の場合は追加の RAF を予約しない。
  if (state.rendering.has(pre)) {
    return
  }

  requestBaf(() => {
    if (state.pending.has(pre)) {
      state.pending.delete(pre)
      void renderPre(pre, context, state, requestBaf)
    }
  })
}

/**
 * {@link pre} の描画処理を終了する.
 */
function finishRender(
  pre: Element,
  context: RenderContext,
  state: RenderState,
  requestBaf: ScheduleFrame,
) {
  state.rendering.delete(pre)

  if (!context.signal.aborted && state.pending.has(pre)) {
    state.pending.delete(pre)
    scheduleRender(pre, context, state, requestBaf)
  }
}

/**
 * Mermaid {@link source} を {@link pre} に描画する.
 */
async function renderPre(
  pre: Element,
  context: RenderContext,
  state: RenderState,
  requestBaf: ScheduleFrame,
) {
  // effect が無効の場合は描画しない。
  if (context.signal.aborted) {
    return
  }

  // 描画中の場合は追加の描画要求を登録する。
  if (state.rendering.has(pre)) {
    state.pending.add(pre)
    return
  }

  state.rendering.add(pre)

  const [source, id] = getSourceAndId(pre)

  try {
    const { svg, bindFunctions } = await mermaid.render(
      `${id}-${context.prefersDark ? 'dark' : 'light'}`,
      source,
      pre,
    )

    // effect が有効の場合に限り、描画結果を DOM に反映させる。
    if (!context.signal.aborted) {
      pre.innerHTML = svg
      bindFunctions?.(pre)
    }
  } catch (error) {
    if (!context.signal.aborted) {
      console.error('Failed to render Mermaid diagram:', error)
    }
  } finally {
    finishRender(pre, context, state, requestBaf)
  }
}

/**
 * 複数の callback を RAF にまとめるための関数を生成する.
 */
function createBaf(): {
  /**
   * {@link callback} をキューに追加し、RAF が未予約の場合は予約する.
   */
  requestBaf: ScheduleFrame

  /**
   * RAF をキャンセルする.
   */
  cancelBaf(): void
} {
  let frame: number | null = null
  const callbacks: FrameRequestCallback[] = []

  return {
    requestBaf(callback) {
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
    },
    cancelBaf() {
      if (frame != null) {
        cancelAnimationFrame(frame)
        frame = null
      }
    },
  }
}

export function useMermaid() {
  const prefersDark = usePrefersDark()

  useEffect(() => {
    const controller = new AbortController()

    const state: RenderState = {
      pres: document.querySelectorAll('pre.mermaid'),
      rendering: new WeakSet(),
      pending: new WeakSet(),
    }

    const { requestBaf, cancelBaf } = createBaf()

    const widths = new WeakMap<Element, number>()

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const pre = entry.target
        const width = entry.contentRect.width
        const previousWidth = widths.get(pre)

        widths.set(pre, width)

        if (width <= 0) {
          continue
        }

        if (previousWidth == null || Math.abs(width - previousWidth) >= 1) {
          scheduleRender(
            pre,
            { signal: controller.signal, prefersDark },
            state,
            requestBaf,
          )
        }
      }
    })

    mermaid.initialize({
      startOnLoad: false,
      theme: prefersDark ? 'neo-dark' : 'neo',
      themeVariables: {
        fontSize: 'unset',
      },
    })

    ;(async () => {
      await document.fonts.ready

      if (controller.signal.aborted) {
        return
      }

      for (const pre of state.pres) {
        observer.observe(pre)
      }
    })()

    return () => {
      controller.abort()
      observer.disconnect()
      cancelBaf()
    }
  }, [prefersDark])
}
