import { useEffect } from 'preact/hooks'
import type { KeyBind } from '~/lib/keybind'
import {
  type Handler,
  type KeymapEntry,
  registerKeymap,
} from '~/lib/keymapRegistry'

export function useKeymap(bind: KeyBind, handler: Handler) {
  useEffect(() => {
    const keymapEntry: KeymapEntry = { bind, handler }

    return registerKeymap(keymapEntry)
  }, [bind, handler])
}
