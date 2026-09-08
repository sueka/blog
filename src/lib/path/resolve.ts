const CWD = '/'

export function resolve(...paths: string[]): string {
  const lastAbsolutePathIndex = paths.findLastIndex((p) => p.startsWith('/'))
  const relevantPaths =
    lastAbsolutePathIndex !== -1
      ? paths.slice(lastAbsolutePathIndex)
      : [CWD, ...paths]
  const isAbsolute = relevantPaths[0]?.startsWith('/') ?? false
  const parts = relevantPaths.flatMap((path) =>
    path.split('/').filter((p) => p !== ''),
  )

  const stack: string[] = []

  for (const part of parts) {
    switch (part) {
      case '.':
        break
      case '..':
        stack.pop()
        break
      default:
        stack.push(part)
    }
  }

  if (stack.length === 0) {
    return isAbsolute ? '/' : '.'
  }

  return (isAbsolute ? '/' : '') + stack.join('/')
}

if (import.meta.vitest) {
  const { expect, it } = import.meta.vitest

  it('returns "." with no arguments', () => {
    expect(resolve()).toBe('/')
  })

  it('returns "." for empty strings', () => {
    expect(resolve('')).toBe('/')
    expect(resolve('', '')).toBe('/')
  })

  it('returns a simple relative path unchanged', () => {
    expect(resolve('a')).toBe('/a')
    expect(resolve('a/b')).toBe('/a/b')
  })

  it('joins multiple arguments', () => {
    expect(resolve('a', 'b')).toBe('/a/b')
    expect(resolve('a', 'b', 'c')).toBe('/a/b/c')
  })

  it('treats a leading "/" as an absolute path', () => {
    expect(resolve('/a/b')).toBe('/a/b')
    expect(resolve('/')).toBe('/')
  })

  it('uses the last absolute path when multiple are given, discarding earlier arguments', () => {
    expect(resolve('/x/y', '/a/b')).toBe('/a/b')
    expect(resolve('/x/y', '/a/b', 'c')).toBe('/a/b/c')
  })

  it('discards relative arguments preceding a later absolute argument', () => {
    expect(resolve('a', '/b')).toBe('/b')
    expect(resolve('a/b/c', '/d')).toBe('/d')
  })

  it('resolves ".." relative to the last absolute path only', () => {
    expect(resolve('/x/y', '/a/b', '../c')).toBe('/a/c')
  })

  it('ignores "."', () => {
    expect(resolve('a/./b')).toBe('/a/b')
    expect(resolve('.', 'a')).toBe('/a')
  })

  it('resolves ".." by going up one segment', () => {
    expect(resolve('a/b/../c')).toBe('/a/c')
    expect(resolve('a', '..', 'b')).toBe('/b')
  })

  it('ignores ".." that would go above the top for relative paths', () => {
    expect(resolve('..')).toBe('/')
    expect(resolve('a/../..')).toBe('/')
    expect(resolve('../../a')).toBe('/a')
  })

  it('ignores ".." that would go above the root for absolute paths', () => {
    expect(resolve('/..')).toBe('/')
    expect(resolve('/a/../..')).toBe('/')
  })

  it('treats consecutive "/" as a single separator', () => {
    expect(resolve('a//b')).toBe('/a/b')
    expect(resolve('/a//b//c')).toBe('/a/b/c')
  })

  it('returns "." or "/" when the stack becomes empty after resolving ".."', () => {
    expect(resolve('a/..')).toBe('/')
    expect(resolve('/a/..')).toBe('/')
  })

  it('resolves ".." spanning multiple arguments', () => {
    expect(resolve('/a/b', 'c', '../d')).toBe('/a/b/d')
    expect(resolve('a', 'b', '..', 'c')).toBe('/a/c')
  })
}
