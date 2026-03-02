import { type FC, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './PageTransition.module.css';

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition: FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div key={location.pathname} className={styles.page}>
      {children}
    </div>
  );
};

export default PageTransition;
