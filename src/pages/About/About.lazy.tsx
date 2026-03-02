import { lazy, Suspense } from 'react';

const LazyAbout = lazy(() => import('./About'));

const About = (props: Record<string, unknown>) => (
  <Suspense fallback={null}>
    <LazyAbout {...props} />
  </Suspense>
);

export default About;
