import styles from './Card.module.css';

interface CardProps {
  children: any;
}

const Card = ({ children }: CardProps) => (
  <div className={styles.Card}>
    {children}
  </div>
);

export default Card;
