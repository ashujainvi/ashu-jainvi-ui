import type { ReactNode } from 'react';
import styles from './Pill.module.css';

interface PillProps {
  variant?: 'primary' | 'secondary';
  showBorder?: boolean;
  children: ReactNode;
}

const Pill = ({
  variant = 'primary',
  showBorder = false,
  children
}: PillProps) => (
  <div className={`rounded-full ${styles.pill} ${styles[variant]} ${!showBorder ? styles.noBorder : ''}`}>
    {children}
  </div>
);

export default Pill;
