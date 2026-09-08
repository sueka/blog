export function fail(): never {
  throw new Error('Failed')
}

if (import.meta.vitest) {
  const { expect, it } = import.meta.vitest

  it('fails', () => {
    expect(() => fail()).toThrow()
  })
}
