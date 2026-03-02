import { type FC, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Nav.module.css';
import letterALogo from '../../assets/letter-a-secondary.svg';
import Menu from '../Menu/Menu';

const Nav: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isMenuOpen]);

  return (
    <nav className={styles.Nav}>
      <Link to="/" className={styles.CircleSurface} aria-label="Home">
        <img src={letterALogo} alt="" className={styles.LogoImage} />
      </Link>
      <div className={styles.menuWrapper}>
        <button
          type="button"
          className={`${styles.CircleSurface} ${styles.menuButton}`}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.lineTopOpen : ''}`} />
          <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.lineBottomOpen : ''}`} />
        </button>
        <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </div>
    </nav>
  );
};

export default Nav;
