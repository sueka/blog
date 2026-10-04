export interface KeyBind {
  key: string
  ctrlKey?: boolean
}

export function matches(bind: KeyBind, event: KeyboardEvent): boolean {
  if (event.isComposing) return false
  if (event.metaKey || event.altKey || event.shiftKey) return false
  if (bind.key.toLowerCase() !== event.key.toLowerCase()) return false
  if (bind.ctrlKey != null && bind.ctrlKey !== event.ctrlKey) return false

  return true
}
