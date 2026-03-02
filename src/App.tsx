import { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Nav from './organisms/Nav/Nav';
import Footer from './organisms/Footer/Footer';
import ScrollToTop from './hooks/ScrollToTop';
import Home from './pages/Home/Home.lazy';
import About from './pages/About/About.lazy';
import Photos from './pages/Photos/Photos.lazy';
import AlbumPage from './pages/Photos/AlbumPage.lazy';
import Contact from './pages/Contact/Contact.lazy';
import PageTransition from './components/PageTransition/PageTransition';
import { captureUtmParams, getStoredUtmParams } from './utils/analytics';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function usePageTracking() {
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Capture UTM params on every navigation (landing page will have them in the URL)
    captureUtmParams(location.search);

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // gtag config in index.html handles the initial page view
    }

    const utm = getStoredUtmParams();
    window.gtag?.('event', 'page_view', {
      page_path: location.pathname + location.search,
      ...(utm.utm_source && { campaign_source: utm.utm_source }),
      ...(utm.utm_medium && { campaign_medium: utm.utm_medium }),
      ...(utm.utm_campaign && { campaign_name: utm.utm_campaign }),
      ...(utm.utm_term && { campaign_term: utm.utm_term }),
      ...(utm.utm_content && { campaign_content: utm.utm_content }),
    });
  }, [location]);
}

function AppRoutes() {
  usePageTracking();
  return (
    <PageTransition>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/photos" element={<Photos />} />
        <Route path="/photos/:albumId" element={<AlbumPage />} />
        <Route path="/contact" element={<Contact />} />
        {/* Clean redirect for Instagram bio link — use https://ashujainvi.com/instagram */}
        <Route
          path="/instagram"
          element={
            <Navigate
              to="/?utm_source=instagram&utm_medium=social&utm_campaign=bio_link"
              replace
            />
          }
        />
      </Routes>
    </PageTransition>
  );
}

function App() {
  useEffect(() => {
    // Dynamically import the unimportant CSS file
    import('./styles/typography.css').catch((err) =>
      console.error('Failed to load typography:', err)
    );
  }, []);
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Nav />
      <AppRoutes />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
