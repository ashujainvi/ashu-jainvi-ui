import { useRef, type FC } from 'react';
import useMagnetic from '../../hooks/useMagnetic';
import useSpotlight from '../../hooks/useSpotlight';
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
  onClick?: () => void;
  redHue?: boolean;
}

const PhotoCard: FC<PhotoCardProps> = ({ image, alt, caption, uppercaseCaption = false, className = '', width, height, srcSet, sizes, onClick, redHue = false }) => {
  const figureRef = useRef<HTMLElement>(null);
  const magneticProps = useMagnetic({ strength: 0.2, radius: 200 });
  useSpotlight(figureRef);

  return (
    <figure
      ref={figureRef}
      {...magneticProps}
      className={`${styles.photoCard} ${redHue ? styles.redHue : ''} ${className}`.trim()}
      style={caption ? { '--caption-text-transform': uppercaseCaption ? 'uppercase' : 'none' } as React.CSSProperties : undefined}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
    >
      {redHue ? (
        <div className={styles.imageWrapper}>
          <img src={image} alt={alt} className={styles.image} width={width} height={height} srcSet={srcSet} sizes={sizes} loading="lazy" decoding="async" />
        </div>
      ) : (
        <img src={image} alt={alt} className={styles.image} width={width} height={height} srcSet={srcSet} sizes={sizes} loading="lazy" decoding="async" />
      )}
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
};

export default PhotoCard;
