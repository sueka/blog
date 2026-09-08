import { useRoute } from 'preact-iso'
import { findPostByPermalink } from '~/contents'
import { PostView } from '../PostView'
import { NotFound } from './NotFound'

export const PostRoute: React.FC = () => {
  const { path } = useRoute()
  const post = findPostByPermalink(path)

  if (post == null) {
    return <NotFound />
  }

  return <PostView post={post} />
}
