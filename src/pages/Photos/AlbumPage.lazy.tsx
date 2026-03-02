import { lazy, Suspense } from 'react';

const LazyAlbumPage = lazy(() => import('./AlbumPage'));

const AlbumPage = (props: Record<string, unknown>) => (
  <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
    <LazyAlbumPage {...props} />
  </Suspense>
);

export default AlbumPage;
