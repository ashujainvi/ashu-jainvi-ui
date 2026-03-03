import { useMemo, useRef } from 'react';
import styles from './Photos.module.css';
import Seo from '../../components/Seo/Seo';
import AlbumCard from '../../molecules/AlbumCard/AlbumCard';
import useParallax from '../../hooks/useParallax';
import TwinkleCanvas from '../../atoms/TwinkleCanvas/TwinkleCanvas';
import { heroPhoto, albums, SIZES_HERO } from '../../data/photos';

const Photos = () => {
  const photoCardRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);
  const heroOverlineRef = useRef<HTMLSpanElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);

  const heroRef = useParallax(useMemo(() => [
    { ref: photoCardRef, speed: 40, scale: [1, 0.97] as [number, number] },
    { ref: heroImageRef, speed: -25 },
    { ref: heroOverlineRef, speed: -40, fadeOut: true },
    { ref: heroTitleRef, speed: -70, scale: [1, 1.06] as [number, number], fadeOut: true },
  ], []));

  return (
    <div className={styles.photos}>
      <Seo
        title="Photography Portfolio"
        description="Browse Ashu Jainvi's photography portfolio featuring portrait sessions, concerts, soccer action shots, and untapped talent sports photography in Austin, Texas."
        path="/photos"
      />
      <section ref={heroRef} className={styles.heroSection}>
        <div ref={photoCardRef} className={styles.photoCard}>
          <img
            ref={heroImageRef}
            src={heroPhoto.src}
            srcSet={heroPhoto.srcSet}
            sizes={SIZES_HERO}
            alt={heroPhoto.alt}
            width={heroPhoto.width}
            height={heroPhoto.height}
            className={styles.photoImage}
          />
          <TwinkleCanvas />
          <div className={styles.heroContent}>
            <span ref={heroOverlineRef} className="text-overline">Explore</span>
            <h1 ref={heroTitleRef} className="display">Photos</h1>
          </div>
        </div>
      </section>
      <section className={styles.albumsSection}>
        <h2 className="title4 text-gray-400">Albums</h2>
        <div className={styles.albumsGrid}>
          {albums.map(album => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Photos;
