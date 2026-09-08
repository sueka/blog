import type { AnchorHTMLAttributes } from 'preact'
import { useRoute } from 'preact-iso'
import { findContentByPermalink, findContentBySourcePath } from '~/contents'
import { fail } from '~/lib/fail'
import { dirname } from '~/lib/path/dirname'
import { resolve } from '~/lib/path/resolve'

interface OwnProps {
  to: string
}

type InternalLinkProps = OwnProps & Omit<AnchorHTMLAttributes, 'href'>

/**
 * リンク先をソース上のパスで指せる、内部リンク用ユーティリティコンポーネント.
 *
 * @param to リンク先のパス. `href` という名前の属性は Velite のアセット管理に発見されて Public URL に置き換えられるため、名前は `to` とする.
 */
export const InternalLink: React.FC<InternalLinkProps> = ({
  to,
  children,
  ...props
}) => {
  const { path } = useRoute()
  const current = findContentByPermalink(path) ?? fail()
  const targetSourcePath = resolve(dirname(current.sourcePath), to)
  const target = findContentBySourcePath(targetSourcePath) ?? fail()

  return (
    <a href={target.permalink} {...props}>
      {children}
    </a>
  )
}
