import styles from './Card.module.css';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  shape?: 'ellipse' | 'rectangle';
}

const Card = ({ children, shape = 'rectangle' }: CardProps) => {
  const cardClasses = shape === 'ellipse' 
    ? `${styles.cardEllipse}` 
    : 'rounded-2xl';
  const contentClasses = shape === 'ellipse' 
    ? `${styles.cardContentEllipse}` 
    : 'rounded-md';
  
  return (
    <div className={`${styles.card} ${cardClasses}`}>
      <div className={`${styles.cardContent} ${contentClasses}`}>{children}</div>
    </div>
  );
};

export default Card;
