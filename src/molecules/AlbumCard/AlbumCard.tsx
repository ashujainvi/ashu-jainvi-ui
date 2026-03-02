import { useRef, type FC } from 'react';
import { Link } from 'react-router-dom';
import useMagnetic from '../../hooks/useMagnetic';
import useSpotlight from '../../hooks/useSpotlight';
import type { Album } from '../../data/photos';
import { SIZES_COVER } from '../../data/photos';
import styles from './AlbumCard.module.css';

interface AlbumCardProps {
  album: Album;
}

const AlbumCard: FC<AlbumCardProps> = ({ album }) => {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const magneticProps = useMagnetic({ strength: 0.15, radius: 200 });
  useSpotlight(cardRef);

  return (
    <Link
      ref={cardRef}
      to={`/photos/${album.id}`}
      {...magneticProps}
      className={styles.albumCard}
      aria-label={`${album.title} — ${album.photos.length} photo${album.photos.length !== 1 ? 's' : ''}`}
    >
      <img
        src={album.cover.src}
        srcSet={album.cover.srcSet}
        sizes={SIZES_COVER}
        alt={album.cover.alt}
        width={album.cover.width}
        height={album.cover.height}
        className={styles.coverImage}
        loading="lazy"
        decoding="async"
      />
      <div className={styles.overlay}>
        <span className={styles.count}>{album.photos.length} photo{album.photos.length !== 1 ? 's' : ''}</span>
        <h3 className={styles.title}>{album.title}</h3>
        {album.description && (
          <p className={styles.description}>{album.description}</p>
        )}
      </div>
    </Link>
  );
};

export default AlbumCard;
