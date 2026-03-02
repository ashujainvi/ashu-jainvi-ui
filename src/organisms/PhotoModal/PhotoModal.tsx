import { type FC, useCallback, useEffect, useState } from 'react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import styles from './PhotoModal.module.css';

export interface PhotoItem {
  src: string;
  alt: string;
  srcSet?: string;
}

interface PhotoModalProps {
  photos: PhotoItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const PhotoModal: FC<PhotoModalProps> = ({ photos, currentIndex, isOpen, onClose, onNavigate }) => {
  const { containerRef } = useFocusTrap<HTMLDivElement>({
    isOpen,
    onClose,
    focusableSelector: 'button[tabindex="0"]',
  });

  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Reset loaded state when image changes
  useEffect(() => {
    setLoaded(false);
  }, [currentIndex]);

  const current = photos[currentIndex];
  const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
  const nextIndex = (currentIndex + 1) % photos.length;
  const prevPhoto = photos[prevIndex];
  const nextPhoto = photos[nextIndex];

  const goToPrev = useCallback(() => {
    setDirection('left');
    onNavigate(prevIndex);
  }, [onNavigate, prevIndex]);

  const goToNext = useCallback(() => {
    setDirection('right');
    onNavigate(nextIndex);
  }, [onNavigate, nextIndex]);

  // Reset direction when modal opens so the first image doesn't slide
  useEffect(() => {
    if (isOpen) setDirection(null);
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    },
    [isOpen, goToPrev, goToNext],
  );

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!current) return null;

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={containerRef}
        className={`${styles.modal} ${isOpen ? styles.modalOpen : ''}`}
        role="dialog"
        aria-modal={isOpen}
        aria-label="Photo viewer"
        aria-hidden={!isOpen}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className={`${styles.imageContainer} ${loaded ? styles.imageContainerLoaded : ''}`}>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            tabIndex={isOpen ? 0 : -1}
            aria-label="Close photo viewer"
          >
            <svg className={styles.closeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <img
            key={currentIndex}
            src={current.src}
            srcSet={current.srcSet}
            sizes="90vw"
            alt={current.alt}
            onLoad={() => setLoaded(true)}
            className={`${styles.mainImage} ${loaded ? styles.imageLoaded : ''} ${direction === 'left' ? styles.slideFromLeft : ''} ${direction === 'right' ? styles.slideFromRight : ''}`}
          />
        </div>

        <div className={styles.navigation}>
          <button
            type="button"
            className={styles.navButton}
            onClick={goToPrev}
            tabIndex={isOpen ? 0 : -1}
            aria-label="Previous photo"
          >
            <img src={prevPhoto.src} alt="" className={styles.previewImage} />
            <span className={styles.navLabel}>Prev</span>
          </button>

          <span className={styles.counter}>
            {currentIndex + 1} / {photos.length}
          </span>

          <button
            type="button"
            className={styles.navButton}
            onClick={goToNext}
            tabIndex={isOpen ? 0 : -1}
            aria-label="Next photo"
          >
            <span className={styles.navLabel}>Next</span>
            <img src={nextPhoto.src} alt="" className={styles.previewImage} />
          </button>
        </div>
      </div>
    </>
  );
};

export default PhotoModal;
