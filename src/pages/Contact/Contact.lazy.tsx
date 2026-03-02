import { lazy, Suspense } from 'react';

const LazyContact = lazy(() => import('./Contact'));

const Contact = (props: Record<string, unknown>) => (
  <Suspense fallback={null}>
    <LazyContact {...props} />
  </Suspense>
);

export default Contact;
