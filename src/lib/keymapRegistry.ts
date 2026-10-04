import { type KeyBind, matches } from './keybind'

export type Handler = (event: KeyboardEvent) => void

export interface KeymapEntry {
  bind: KeyBind
  handler: Handler
}

const keymap = new Map<number, KeymapEntry>()
let nextId = 0
let detach: (() => void) | null | undefined

function attach() {
  const onKeyDown = (event: KeyboardEvent) => {
    for (const [, { bind, handler }] of keymap) {
      if (matches(bind, event)) {
        handler(event)
      }
    }
  }

  window.addEventListener('keydown', onKeyDown)

  detach = () => {
    window.removeEventListener('keydown', onKeyDown)
    detach = null
  }
}

export function registerKeymap(keymapEntry: KeymapEntry): () => void {
  const id = nextId++

  keymap.set(id, keymapEntry)

  if (detach == null) {
    attach()
  }

  return () => {
    const deleted = keymap.delete(id)

    if (deleted && keymap.size === 0) {
      detach?.()
    }
  }
}
