import type { FC } from 'react';
import styles from './PhotoCard.module.css';

interface PhotoCardProps {
  image: string;
  alt: string;
  caption?: string;
  uppercaseCaption?: boolean;
  className?: string;
  width?: number;
  height?: number;
  srcSet?: string;
  sizes?: string;
}

const PhotoCard: FC<PhotoCardProps> = ({ image, alt, caption, uppercaseCaption = false, className = '', width, height, srcSet, sizes }) => (
  <figure
    className={`${styles.photoCard} ${className}`.trim()}
    style={caption ? { '--caption-text-transform': uppercaseCaption ? 'uppercase' : 'none' } as React.CSSProperties : undefined}
  >
    <img src={image} alt={alt} className={styles.image} width={width} height={height} srcSet={srcSet} sizes={sizes} loading="lazy" decoding="async" />
    {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
  </figure>
);

export default PhotoCard;
