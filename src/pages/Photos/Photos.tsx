import { useState, useMemo, useRef } from 'react';
import styles from './Photos.module.css';
import Seo from '../../components/Seo/Seo';
import PhotoCard from '../../molecules/PhotoCard/PhotoCard';
import PhotoModal from '../../organisms/PhotoModal/PhotoModal';
import type { PhotoItem } from '../../organisms/PhotoModal/PhotoModal';
import useParallax from '../../hooks/useParallax';
import TwinkleCanvas from '../../atoms/TwinkleCanvas/TwinkleCanvas';
import { heroPhoto, featuredPhotos, banditsPhotos, youthPhotos, SIZES_GRID, SIZES_HERO } from '../../data/photos';

const Photos = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const photoCardRef = useRef<HTMLDivElement>(null);
  const heroOverlineRef = useRef<HTMLSpanElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);

  const heroRef = useParallax(useMemo(() => [
    { ref: photoCardRef, speed: 40, scale: [1, 0.97] as [number, number] },
    { ref: heroOverlineRef, speed: -40, fadeOut: true },
    { ref: heroTitleRef, speed: -70, scale: [1, 1.06] as [number, number], fadeOut: true },
  ], []));

  const allPhotos: PhotoItem[] = useMemo(() => [
    ...featuredPhotos.map(p => ({ src: p.src, alt: p.alt, srcSet: p.srcSet })),
    ...banditsPhotos.map(p => ({ src: p.src, alt: p.alt, srcSet: p.srcSet })),
    ...youthPhotos.map(p => ({ src: p.src, alt: p.alt, srcSet: p.srcSet })),
  ], []);

  const openModal = (sectionOffset: number, index: number) => {
    setCurrentIndex(sectionOffset + index);
    setModalOpen(true);
  };

  return (
  <div className={styles.photos}>
    <Seo
      title="Photography Portfolio"
      description="Browse Ashu Jainvi's photography portfolio featuring portrait sessions, Bandits FC soccer action shots, and youth sports photography in Austin, Texas."
      path="/photos"
    />
    <section ref={heroRef} className={styles.heroSection}>
      <div ref={photoCardRef} className={styles.photoCard}>
        <img
          src={heroPhoto.src}
          srcSet={heroPhoto.srcSet}
          sizes={SIZES_HERO}
          alt={heroPhoto.alt}
          width={heroPhoto.width}
          height={heroPhoto.height}
          className={styles.photoImage}
        />
        <TwinkleCanvas />
      </div>
      <div className={styles.heroContent}>
        <span ref={heroOverlineRef} className="text-overline">Explore</span>
        <h1 ref={heroTitleRef} className="display">Photos</h1>
      </div>
    </section>
    <section className={styles.featuredSection}>
      <h2 className="title4 text-gray-400">Featured</h2>
      <div className={styles.featuredGrid}>
        {featuredPhotos.map((photo, i) => (
          <PhotoCard
            key={i}
            image={photo.src}
            srcSet={photo.srcSet}
            sizes={SIZES_GRID}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            className={styles.featuredCard}
            onClick={() => openModal(0, i)}
          />
        ))}
      </div>
    </section>
    <section className={styles.featuredSection}>
      <h2 className="title4 text-gray-400">Bandits FC</h2>
      <div className={styles.banditsGrid}>
        {banditsPhotos.map((photo, i) => (
          <PhotoCard
            key={i}
            image={photo.src}
            srcSet={photo.srcSet}
            sizes={SIZES_GRID}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            className={styles.banditsCard}
            onClick={() => openModal(featuredPhotos.length, i)}
          />
        ))}
      </div>
    </section>
    <section className={styles.featuredSection}>
      <h2 className="title4 text-gray-400">Youth</h2>
      <div className={styles.youthGrid}>
        {youthPhotos.map((photo, i) => (
          <PhotoCard
            key={i}
            image={photo.src}
            srcSet={photo.srcSet}
            sizes={SIZES_GRID}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            className={styles.featuredCard}
            onClick={() => openModal(featuredPhotos.length + banditsPhotos.length, i)}
          />
        ))}
      </div>
    </section>
    <PhotoModal
      photos={allPhotos}
      currentIndex={currentIndex}
      isOpen={modalOpen}
      onClose={() => setModalOpen(false)}
      onNavigate={setCurrentIndex}
    />
  </div>
);
}

export default Photos;
