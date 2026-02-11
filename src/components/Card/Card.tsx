import styles from './Card.module.css';
import type { ReactNode } from 'react';

declare module 'react' {
  interface CSSProperties {
    '--border-url'?: string;
  }
}

interface CardProps {
  children: ReactNode;
  shape?: 'ellipse' | 'rectangle';
}

const Card = ({ children, shape = 'rectangle' }: CardProps) => {
  return (
    <div className={`${styles.card}`}>
      <div className={styles.cardContent}>{children}</div>
    </div>
  );
};

export default Card;
