import styles from './Card.module.css';
import rectangle from '../../assets/border.png';
import ellipse from '../../assets/torn-ellipse-border.png';
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
  const borderImage = shape === 'ellipse' ? ellipse : rectangle;
  
  return (
    <div className={`${styles.Card}`} style={{ '--border-url': `url(${borderImage})` }}>
      <div className={styles.cardContent}>{children}</div>
    </div>
  );
};

export default Card;
