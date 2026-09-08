import { findPageByPermalink } from '~/contents'
import { fail } from '~/lib/fail'
import { PageView } from '../PageView'

const page404 = findPageByPermalink('/404') ?? fail()

export const NotFound: React.FC = () => <PageView page={page404} />
