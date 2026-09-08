import type { MDXProps } from 'mdx/types'
import { mdxCache } from '~/mdxCache'
import classes from './MdxContent.module.css'

interface MdxContentProps {
  code: string
}

/**
 * MDX code をコンポーネントに変換し、レンダリングする.
 */
export const MdxContent: React.FC<MdxContentProps & MDXProps> = ({
  code,
  ...props
}) => {
  const Component = mdxCache.loadMdxComponent(code)

  return (
    <div class={classes['MdxContent']}>
      <Component {...props} />
    </div>
  )
}
