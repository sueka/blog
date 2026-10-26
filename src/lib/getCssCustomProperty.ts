import { fail } from '~/lib/fail'

export function getCssCustomProperty(name: `--${string}`) {
  return globalThis
    .getComputedStyle(document.querySelector(':root') ?? fail())
    .getPropertyValue(name)
}
