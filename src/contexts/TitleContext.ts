import { signal } from '@preact/signals'
import { createContext } from 'preact'

/**
 * 現在の <title> を管理する.
 */
export const TitleContext = createContext(signal(''))
