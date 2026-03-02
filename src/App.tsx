import { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Nav from './organisms/Nav/Nav';
import Footer from './organisms/Footer/Footer';
import ScrollToTop from './hooks/ScrollToTop';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Photos from './pages/Photos/Photos';
import Contact from './pages/Contact/Contact';
import PageTransition from './components/PageTransition/PageTransition';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function usePageTracking() {
  const location = useLocation();
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // gtag config in index.html handles the initial page view
    }
    window.gtag?.('event', 'page_view', {
      page_path: location.pathname + location.search,
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
        <Route path="/contact" element={<Contact />} />
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
