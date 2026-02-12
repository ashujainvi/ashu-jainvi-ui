import type { FC } from 'react';
import { Link } from 'react-router-dom';
import styles from './Nav.module.css';
import letterALogo from '../../assets/letter-a.svg';
import glassSurface from '../../assets/glass-surface.png';

const Nav: FC = () => (
  <nav className={styles.Nav}>
    <Link to="/" className={styles.Logo} style={{ backgroundImage: `url(${glassSurface})` }}>
      <img src={letterALogo} alt="Logo" className={styles.LogoImage} />
    </Link>
    <div className={styles.MenuIcon} style={{ backgroundImage: `url(${glassSurface})` }}>
      <button type="button" className={styles.MenuButton} aria-label="Menu">
        <span className="bg-secondary block w-[35px] h-[2px] rounded-sm transition-all"></span>
        <span className="bg-secondary block w-[35px] h-[2px] rounded-sm transition-all"></span>
      </button>
    </div>
  </nav>
);

export default Nav;
