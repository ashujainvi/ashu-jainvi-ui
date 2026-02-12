import { useEffect } from 'react';
import './App.css';
import Nav from './components/Nav/Nav';
import Home from './pages/Home/Home';

function App() {
  useEffect(() => {
    // Dynamically import the CSS file
    import('./styles/typography.css').catch((err) =>
      console.error('Failed to load typography:', err)
    );
  }, []);
  return (
    <>
      <Nav />
      <Home />
    </>
  );
}

export default App;
