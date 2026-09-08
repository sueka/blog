import { LocationProvider, Route, Router } from 'preact-iso'
import { NotFound } from './routes/NotFound'
import { PageRoute } from './routes/PageRoute'
import { PostRoute } from './routes/PostRoute'

export const App: React.FC = () => (
  <LocationProvider>
    <Router>
      <Route path="/posts/*" component={PostRoute} />
      <Route default /* path="/*" */ component={PageRoute} />
      <Route path="/404.html" component={NotFound} />
    </Router>
  </LocationProvider>
)
