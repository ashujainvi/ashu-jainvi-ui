import { useState, useCallback, type FC } from 'react';
import type { Album } from '../../data/photos';
import { SIZES_COVER } from '../../data/photos';
import PhotoCard from '../PhotoCard/PhotoCard';
import GlassButton from '../../atoms/GlassButton/GlassButton';
import styles from './AlbumCard.module.css';

interface AlbumCardProps {
  album: Album;
}

const AlbumCard: FC<AlbumCardProps> = ({ album }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      const shareUrl = `${window.location.origin}/photos/${album.id}`;

      // Always copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // clipboard may fail in insecure contexts
      }

      // Open native share sheet if available
      if (navigator.share) {
        try {
          await navigator.share({
            title: album.title,
            text: album.description || album.title,
            url: shareUrl,
          });
        } catch {
          // User cancelled or error
        }
      }
    },
    [album]
  );

  return (
    <div className={styles.albumCardWrapper}>
      <PhotoCard
        image={album.cover.src}
        srcSet={album.cover.srcSet}
        sizes={SIZES_COVER}
        alt={album.cover.alt}
        width={album.cover.width}
        height={album.cover.height}
        linkTo={`/photos/${album.id}`}
        className={styles.albumCard}
        ariaLabel={`${album.title} — ${album.photos.length} photo${album.photos.length !== 1 ? 's' : ''}`}
      >
        <div className={styles.overlay}>
          <span className={styles.count}>{album.photos.length} photo{album.photos.length !== 1 ? 's' : ''}</span>
          <h3 className={styles.title}>{album.title}</h3>
          {album.description && (
            <p className={styles.description}>{album.description}</p>
          )}
        </div>
      </PhotoCard>
      <GlassButton
        className={styles.shareButton}
        title="Share album"
        aria-label="Share album"
        onClick={handleShare}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      </GlassButton>
      {copied && (
        <span className={styles.copiedToast}>Link copied!</span>
      )}
    </div>
  );
};

export default AlbumCard;
