import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Nav from './organisms/Nav/Nav';
import Footer from './organisms/Footer/Footer';
import ScrollToTop from './hooks/ScrollToTop';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Photos from './pages/Photos/Photos';
import Contact from './pages/Contact/Contact';
import PageTransition from './components/PageTransition/PageTransition';

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
      <PageTransition>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/photos" element={<Photos />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </PageTransition>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
