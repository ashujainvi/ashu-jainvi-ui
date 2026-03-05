import { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Pages that should restore scroll position when revisited
const RESTORE_SCROLL_PATHS = new Set(['/photos']);

// Prevent the browser from fighting our manual scroll management
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const prevPathRef = useRef(pathname);

  // Capture scroll position during render — before React commits the new DOM.
  // At this point window.scrollY still reflects the outgoing page's position.
  const prev = prevPathRef.current;
  if (prev !== pathname) {
    if (RESTORE_SCROLL_PATHS.has(prev)) {
      sessionStorage.setItem(`scroll:${prev}`, String(window.scrollY));
    }
    prevPathRef.current = pathname;
  }

  // Apply scroll position synchronously before browser paint
  useLayoutEffect(() => {
    const saved = sessionStorage.getItem(`scroll:${pathname}`);
    if (saved) {
      sessionStorage.removeItem(`scroll:${pathname}`);
      const y = Number(saved);
      // Defer restore to let page content render first
      requestAnimationFrame(() => window.scrollTo(0, y));
      return;
    }

    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
