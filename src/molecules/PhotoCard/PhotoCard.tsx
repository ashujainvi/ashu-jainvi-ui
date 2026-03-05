import { useRef, type FC, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
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
  linkTo?: string;
  children?: ReactNode;
}

const PhotoCard: FC<PhotoCardProps> = ({ image, alt, caption, uppercaseCaption = false, className = '', width, height, srcSet, sizes, onClick, redHue = false, linkTo, children }) => {
  const figureRef = useRef<HTMLElement>(null);
  const magneticProps = useMagnetic({ strength: 0.2, radius: 200 });
  useSpotlight(figureRef);

  const isInteractive = !!(onClick || linkTo);

  const card = (
    <figure
      ref={figureRef}
      {...magneticProps}
      className={`${styles.photoCard} ${redHue ? styles.redHue : ''} ${className}`.trim()}
      style={caption ? { '--caption-text-transform': uppercaseCaption ? 'uppercase' : 'none' } as React.CSSProperties : undefined}
      onClick={linkTo ? undefined : onClick}
      role={!linkTo && onClick ? 'button' : undefined}
      tabIndex={!linkTo && onClick ? 0 : undefined}
      onKeyDown={!linkTo && onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
    >
      {redHue ? (
        <div className={styles.imageWrapper}>
          <img src={image} alt={alt} className={styles.image} width={width} height={height} srcSet={srcSet} sizes={sizes} loading="lazy" decoding="async" />
        </div>
      ) : (
        <img src={image} alt={alt} className={`${styles.image} ${isInteractive ? styles.imageInteractive : ''}`} width={width} height={height} srcSet={srcSet} sizes={sizes} loading="lazy" decoding="async" />
      )}
      {children}
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className={`${styles.linkWrapper} ${className}`.trim()}>
        {card}
      </Link>
    );
  }

  return card;
};

export default PhotoCard;
