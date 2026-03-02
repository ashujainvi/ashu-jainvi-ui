import { lazy, Suspense } from 'react';

const LazyPhotos = lazy(() => import('./Photos'));

const Photos = (props: Record<string, unknown>) => (
  <Suspense fallback={null}>
    <LazyPhotos {...props} />
  </Suspense>
);

export default Photos;
