import { type FC, useCallback, useEffect, useRef, useState } from 'react';
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

const SWIPE_THRESHOLD = 50;
const SWIPE_VELOCITY_THRESHOLD = 0.3;

const PhotoModal: FC<PhotoModalProps> = ({ photos, currentIndex, isOpen, onClose, onNavigate }) => {
  const { containerRef } = useFocusTrap<HTMLDivElement>({
    isOpen,
    onClose,
    focusableSelector: 'button[tabindex="0"]',
  });

  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [loaded, setLoaded] = useState(false);

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const swipeOffsetRef = useRef(0);
  const rafIdRef = useRef(0);

  // Reset loaded state when image changes
  useEffect(() => {
    setLoaded(false);
  }, [currentIndex]);

  const current = photos[currentIndex];
  const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
  const nextIndex = (currentIndex + 1) % photos.length;
  const prevPhoto = photos[prevIndex];
  const nextPhoto = photos[nextIndex];

  // Preload adjacent images for instant navigation
  useEffect(() => {
    if (!isOpen) return;
    const preload = (photo: PhotoItem) => {
      const img = new Image();
      if (photo.srcSet) img.srcset = photo.srcSet;
      img.sizes = '90vw';
      img.src = photo.src;
    };
    preload(photos[prevIndex]);
    preload(photos[nextIndex]);
  }, [isOpen, currentIndex, photos, prevIndex, nextIndex]);

  const goToPrev = useCallback(() => {
    setDirection('left');
    onNavigate(prevIndex);
  }, [onNavigate, prevIndex]);

  const goToNext = useCallback(() => {
    setDirection('right');
    onNavigate(nextIndex);
  }, [onNavigate, nextIndex]);

  // Apply swipe transform directly to DOM via rAF — zero React re-renders
  const applySwipeTransform = useCallback(() => {
    const el = imageContainerRef.current;
    if (!el) return;
    const offset = swipeOffsetRef.current;
    el.style.transform = `translate3d(${offset}px, 0, 0) rotateY(${offset * -0.04}deg) scale(${1 - Math.abs(offset) * 0.0003})`;
    rafIdRef.current = 0;
  }, []);

  const scheduleTransformUpdate = useCallback(() => {
    if (!rafIdRef.current) {
      rafIdRef.current = requestAnimationFrame(applySwipeTransform);
    }
  }, [applySwipeTransform]);

  // Native touch handlers — passive/non-passive for Safari & IG WebView
  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
    imageContainerRef.current?.classList.add(styles.swiping);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;

    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaX) < 10) return;

    e.preventDefault();
    swipeOffsetRef.current = deltaX;
    scheduleTransformUpdate();
  }, [scheduleTransformUpdate]);

  const handleTouchEnd = useCallback(() => {
    if (!touchStartRef.current) return;

    const elapsed = Date.now() - touchStartRef.current.time;
    const offset = swipeOffsetRef.current;
    const velocity = Math.abs(offset) / elapsed;

    if (velocity > SWIPE_VELOCITY_THRESHOLD || Math.abs(offset) > SWIPE_THRESHOLD) {
      if (offset < 0) goToNext();
      else goToPrev();
    }

    touchStartRef.current = null;
    swipeOffsetRef.current = 0;

    const el = imageContainerRef.current;
    if (el) {
      el.classList.remove(styles.swiping);
      el.style.transform = '';
    }

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = 0;
    }
  }, [goToNext, goToPrev]);

  // Attach native touch listeners — passive: true for start/end, false for move (preventDefault)
  useEffect(() => {
    const el = imageContainerRef.current;
    if (!el || !isOpen) return;

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });
    el.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
      el.removeEventListener('touchcancel', handleTouchEnd);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = 0;
      }
    };
  }, [isOpen, handleTouchStart, handleTouchMove, handleTouchEnd]);

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
    document.body.dataset.modalOpen = 'true';
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      delete document.body.dataset.modalOpen;
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
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          tabIndex={isOpen ? 0 : -1}
          aria-label="Close photo viewer"
        >
          <svg className={styles.closeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div
          ref={imageContainerRef}
          className={`${styles.imageContainer} ${loaded ? styles.imageContainerLoaded : ''}`}
          aria-roledescription="carousel"
          aria-label={`Photo ${currentIndex + 1} of ${photos.length}`}
          aria-busy={!loaded}
        >
          <img
            key={currentIndex}
            src={current.src}
            srcSet={current.srcSet}
            sizes="90vw"
            alt={current.alt}
            onLoad={() => setLoaded(true)}
            className={`${styles.mainImage} ${loaded ? styles.imageLoaded : ''} ${direction === 'left' ? styles.slideFromLeft : ''} ${direction === 'right' ? styles.slideFromRight : ''}`}
            draggable={false}
          />
        </div>

        <nav className={styles.navigation} aria-label="Photo navigation">
          <p className="sr-only" aria-live="polite" aria-atomic="true">
            Showing photo {currentIndex + 1} of {photos.length}: {current.alt}
          </p>
          <button
            type="button"
            className={styles.navButton}
            onClick={goToPrev}
            tabIndex={isOpen ? 0 : -1}
            aria-label={`Previous photo: ${prevPhoto.alt}`}
          >
            <img src={prevPhoto.src} srcSet={prevPhoto.srcSet} sizes="56px" alt="" className={styles.previewImage} loading="eager" draggable={false} />
            <span className={styles.navLabel} aria-hidden="true">Prev</span>
          </button>

          <span className={styles.counter} aria-hidden="true">
            {currentIndex + 1} / {photos.length}
          </span>

          <button
            type="button"
            className={styles.navButton}
            onClick={goToNext}
            tabIndex={isOpen ? 0 : -1}
            aria-label={`Next photo: ${nextPhoto.alt}`}
          >
            <img src={nextPhoto.src} srcSet={nextPhoto.srcSet} sizes="56px" alt="" className={styles.previewImage} loading="eager" draggable={false} />
            <span className={`${styles.navLabel} ${styles.navLabelNext}`} aria-hidden="true">Next</span>
          </button>
        </nav>
      </div>
    </>
  );
};

export default PhotoModal;
