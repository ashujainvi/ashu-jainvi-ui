import { lazy, Suspense } from 'react';

const LazyPhotos = lazy(() => import('./Photos'));

const Photos = (props: Record<string, unknown>) => (
  <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
    <LazyPhotos {...props} />
  </Suspense>
);

export default Photos;
