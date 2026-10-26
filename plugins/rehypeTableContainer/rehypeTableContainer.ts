import assert from 'node:assert'
import type { Root } from 'hast'
import { SKIP, visit } from 'unist-util-visit'

function assertNonNull<T>(value: T | null | undefined): asserts value is T {
  assert(value != null)
}

export function rehypeTableContainer() {
  return (tree: Root) => {
    visit(tree, 'element', (node, index, parent) => {
      assertNonNull(parent)
      assertNonNull(index)

      if (node.tagName === 'table') {
        parent.children[index] = {
          type: 'element',
          tagName: 'div',
          properties: {
            className: ['table-container'],
          },
          children: [node],
        }

        return SKIP
      }

      return
    })
  }
}
