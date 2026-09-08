import { createMdxCache } from './lib/mdxCache'
import { createResourceCache } from './lib/resourceCache'

export const mdxCache = createMdxCache(createResourceCache())
