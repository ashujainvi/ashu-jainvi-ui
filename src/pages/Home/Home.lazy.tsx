import { lazy, Suspense } from 'react';

const LazyHome = lazy(() => import('./Home'));

const Home = (props: Record<string, unknown>) => (
  <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
    <LazyHome {...props} />
  </Suspense>
);

export default Home;
