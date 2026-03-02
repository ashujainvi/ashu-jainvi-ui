import type { FC } from 'react';
import styles from './PhotoCard.module.css';

interface PhotoCardProps {
  image: string;
  caption: string;
  alt: string;
  uppercaseCaption?: boolean;
}

const PhotoCard: FC<PhotoCardProps> = ({ image, caption, alt, uppercaseCaption = false }) => (
  <figure
    className={styles.photoCard}
    style={{ '--caption-text-transform': uppercaseCaption ? 'uppercase' : 'none' } as React.CSSProperties}
  >
    <img src={image} alt={alt} className={styles.image} />
    <figcaption className={styles.caption}>{caption}</figcaption>
  </figure>
);

export default PhotoCard;
