import { useState, useMemo } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import styles from './AlbumPage.module.css';
import Seo from '../../components/Seo/Seo';
import PhotoCard from '../../molecules/PhotoCard/PhotoCard';
import PhotoModal from '../../organisms/PhotoModal/PhotoModal';
import type { PhotoItem } from '../../organisms/PhotoModal/PhotoModal';
import { albums, SIZES_ALBUM_GRID } from '../../data/photos';

type GridVariant = 'portrait' | 'portraitWide' | 'landscape';

function getGridVariant(width: number, height: number): GridVariant {
  const ratio = width / height;
  if (ratio > 1) return 'landscape';
  if (ratio <= 0.70) return 'portrait';
  return 'portraitWide';
}

const AlbumPage = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const album = albums.find(a => a.id === albumId);

  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const modalPhotos: PhotoItem[] = useMemo(
    () => album?.photos.map(p => ({ src: p.src, alt: p.alt, srcSet: p.srcSet })) ?? [],
    [album],
  );

  if (!album) return <Navigate to="/photos" replace />;

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setModalOpen(true);
  };

  return (
    <div className={styles.albumPage}>
      <Seo
        title={`${album.title} — Photography`}
        description={album.description ?? `Browse ${album.photos.length} photos from the ${album.title} collection by Ashu Jainvi.`}
        path={`/photos/${album.id}`}
        image={album.photos[0]?.src}
      />
      <div className={styles.header}>
        <Link to="/photos" className={styles.backLink}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          All albums
        </Link>
        <div className={styles.meta}>
          <span className="text-overline">{album.photos.length} photo{album.photos.length !== 1 ? 's' : ''}</span>
          <h1
            className={`display ${album.gradient ? styles.gradientTitle : ''}`}
            style={album.gradient ? { backgroundImage: `linear-gradient(135deg, ${album.gradient[0]}, ${album.gradient[1]})` } : undefined}
          >
            {album.title}
          </h1>
          {album.description && <p className={styles.description}>{album.description}</p>}
        </div>
      </div>
      <div className={styles.photoGrid}>
        {album.photos.map((photo, i) => {
          const variant = getGridVariant(photo.width, photo.height);
          return (
            <PhotoCard
              key={i}
              image={photo.src}
              srcSet={photo.srcSet}
              sizes={SIZES_ALBUM_GRID}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              className={`${styles.photoCard} ${styles[variant]}`}
              onClick={() => openModal(i)}
            />
          );
        })}
      </div>
      <PhotoModal
        photos={modalPhotos}
        currentIndex={currentIndex}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onNavigate={setCurrentIndex}
      />
    </div>
  );
};

export default AlbumPage;
