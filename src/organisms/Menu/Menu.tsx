import type { FC } from 'react';
import { Link } from 'react-router-dom';
import styles from './Menu.module.css';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Photos', to: '/photos' },
];

const Menu: FC<MenuProps> = ({ isOpen, onClose }) => {
  const { containerRef } = useFocusTrap<HTMLElement>({ isOpen, onClose });

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <nav
        ref={containerRef}
        className={`${styles.menu} ${isOpen ? styles.menuOpen : ''}`}
        aria-label="Main menu"
        aria-hidden={!isOpen}
        role="dialog"
        aria-modal={isOpen}
      >
        <ul className={styles.navList} role="list">
          {navItems.map(({ label, to }, index) => (
            <li
              key={to}
              className={`${styles.navItem} ${isOpen ? styles.navItemVisible : ''}`}
              style={{ transitionDelay: isOpen ? `${index * 60 + 100}ms` : '0ms' }}
            >
              <Link
                to={to}
                className={styles.navLink}
                onClick={onClose}
                tabIndex={isOpen ? 0 : -1}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Menu;
