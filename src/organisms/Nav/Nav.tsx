import { type FC, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Nav.module.css';
import letterALogo from '../../assets/letter-a-secondary.svg';
import Menu from '../Menu/Menu';

const Nav: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className={styles.Nav}>
      <Link to="/" className={styles.CircleSurface} aria-label="Home">
        <img src={letterALogo} alt="" className={styles.LogoImage} />
      </Link>
      <div className={styles.menuWrapper}>
        <button
          type="button"
          className={styles.CircleSurface}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="bg-secondary block w-[20px] h-[2px] rounded-sm"></span>
          <span className="bg-secondary block w-[20px] h-[2px] rounded-sm"></span>
        </button>
        <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </div>
    </nav>
  );
};

export default Nav;
