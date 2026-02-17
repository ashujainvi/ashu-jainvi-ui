import type { FC } from 'react';
import { Link } from 'react-router-dom';
import styles from './Nav.module.css';
import letterALogo from '../../assets/letter-a.svg';
import glassSurface from '../../assets/glass-surface-1.png';

const Nav: FC = () => (
  <nav className={styles.Nav}>
    <Link to="/" className={styles.CircleSurface} style={{ backgroundImage: `url(${glassSurface})` }}>
      <img src={letterALogo} alt="Logo" className={styles.LogoImage} />
    </Link>
    <div className={styles.CircleSurface} style={{ backgroundImage: `url(${glassSurface})` }}>
      <button type="button" className={styles.MenuButton} aria-label="Menu">
        <span className="bg-secondary block w-[20px] h-[2px] rounded-sm"></span>
        <span className="bg-secondary block w-[20px] h-[2px] rounded-sm"></span>
      </button>
    </div>
  </nav>
);

export default Nav;
