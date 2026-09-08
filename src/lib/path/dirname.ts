export function dirname(path: string): string {
  const isAbsolute = path.startsWith('/')
  const parts = path.split('/').filter((p) => p !== '')

  parts.pop()

  if (parts.length === 0) {
    return isAbsolute ? '/' : '.'
  }

  return (isAbsolute ? '/' : '') + parts.join('/')
}

if (import.meta.vitest) {
  const { expect, it } = import.meta.vitest

  it('returns "." for a single relative segment', () => {
    expect(dirname('a')).toBe('.')
  })

  it('returns the parent of a simple relative path', () => {
    expect(dirname('a/b')).toBe('a')
    expect(dirname('a/b/c')).toBe('a/b')
  })

  it('returns "/" for a top-level absolute path', () => {
    expect(dirname('/a')).toBe('/')
  })

  it('returns the parent of a nested absolute path', () => {
    expect(dirname('/a/b')).toBe('/a')
    expect(dirname('/a/b/c')).toBe('/a/b')
  })

  it('returns "/" for the root path', () => {
    expect(dirname('/')).toBe('/')
  })

  it('returns "." for an empty string', () => {
    expect(dirname('')).toBe('.')
  })

  it('treats consecutive "/" as a single separator', () => {
    expect(dirname('a//b')).toBe('a')
    expect(dirname('/a//b//c')).toBe('/a/b')
  })

  it('ignores a trailing "/"', () => {
    expect(dirname('a/b/')).toBe('a')
    expect(dirname('/a/b/')).toBe('/a')
  })

  it('does not treat "." or ".." specially', () => {
    expect(dirname('a/./b')).toBe('a/.')
    expect(dirname('a/../b')).toBe('a/..')
  })
}
