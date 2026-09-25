import { clsx } from 'clsx/lite'
import type { MDXProps } from 'mdx/types'
import type { HTMLAttributes } from 'preact'
import { mdxCache } from '~/mdxCache'
import classes from './MdxContent.module.css'

interface MdxContentProps {
  code: string
  props?: {
    root?: HTMLAttributes<HTMLDivElement>
  }
}

/**
 * MDX code をコンポーネントに変換し、レンダリングする.
 */
export const MdxContent: React.FC<MdxContentProps & MDXProps> = ({
  code,
  props: { root: { class: rootClass, ...rootProps } = {} } = {},
  ...props
}) => {
  const Component = mdxCache.loadMdxComponent(code)

  return (
    <div class={clsx(classes['MdxContent'], rootClass)} {...rootProps}>
      <Component {...props} />
    </div>
  )
}
