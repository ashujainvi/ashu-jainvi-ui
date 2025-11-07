import styles from './Card.module.css';

interface CardProps {
  children: any;
}

const Card = ({ children }: CardProps) => (
  <div className={styles.Card}>
    <div className={styles.cardContent}>{children}</div>
  </div>
);

export default Card;
