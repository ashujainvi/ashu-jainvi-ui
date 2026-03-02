import type { ReactNode } from 'react';
import styles from './Pill.module.css';

interface PillProps {
  variant?: 'primary' | 'secondary';
  showBorder?: boolean;
  overlapOn?: 'left' | 'right';
  children: ReactNode;
}

const Pill = ({
  variant = 'primary',
  showBorder = true,
  overlapOn,
  children
}: PillProps) => (
  <div className={`rounded-full ${styles.pill} ${styles[variant]} ${!showBorder ? styles.noBorder : ''} ${overlapOn ? styles[`overlap-${overlapOn}`] : ''}`}>
    {children}
  </div>
);

export default Pill;
