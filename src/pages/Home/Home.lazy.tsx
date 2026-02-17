import { lazy, Suspense } from 'react';

const LazyHome = lazy(() => import('./Home'));

const Home = (props: Record<string, unknown>) => (
  <Suspense fallback={null}>
    <LazyHome {...props} />
  </Suspense>
);

export default Home;
