import { useRoute } from 'preact-iso'
import { findPageByPermalink } from '~/contents'
import { PageView } from '../PageView'
import { NotFound } from './NotFound'

export const PageRoute: React.FC = () => {
  const { path } = useRoute()
  const page = findPageByPermalink(path)

  if (page == null) {
    return <NotFound />
  }

  return <PageView page={page} />
}
