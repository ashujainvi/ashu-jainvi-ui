import styles from './Card.module.css';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
}

const Card = ({ children }: CardProps) => {
  return (
    <div className={styles.card}>
      {children}
    </div>
  );
};

export default Card;
