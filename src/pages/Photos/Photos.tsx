import { useState, useMemo } from 'react';
import styles from './Photos.module.css';
import Seo from '../../components/Seo/Seo';
import PhotoCard from '../../molecules/PhotoCard/PhotoCard';
import PhotoModal from '../../organisms/PhotoModal/PhotoModal';
import type { PhotoItem } from '../../organisms/PhotoModal/PhotoModal';

// Original JPEG imports (used as fallback src)
import img0033 from '../../assets/photos/IMG_0033.jpg';
import img8298 from '../../assets/photos/IMG_8298.jpg';
import img8201 from '../../assets/photos/IMG_8201.jpg';
import img8259 from '../../assets/photos/IMG_8259.jpg';
import img8306 from '../../assets/photos/IMG_8306.jpg';
import img8320 from '../../assets/photos/IMG_8320.jpg';
import img6615 from '../../assets/photos/youth/IMG_6615.jpg';
import img6627 from '../../assets/photos/youth/IMG_6627.jpg';
import img7224 from '../../assets/photos/youth/IMG_7224.jpg';
import img7360 from '../../assets/photos/youth/IMG_7360.jpg';
import img7157 from '../../assets/photos/youth/IMG_7157.jpg';
import img4725 from '../../assets/photos/bandits/IMG_4725-web-watermarked-2.jpg';
import img4949 from '../../assets/photos/bandits/IMG_4949-web-watermarked-2.jpg';
import img4997 from '../../assets/photos/bandits/IMG_4997-web-watermarked-2.jpg';
import img5016 from '../../assets/photos/bandits/IMG_5016-web-watermarked-2.jpg';
import img5454 from '../../assets/photos/bandits/IMG_5454-web-watermarked-2.jpg';
import img5672 from '../../assets/photos/bandits/IMG_5672-web-watermarked-2.jpg';
import img5687 from '../../assets/photos/bandits/IMG_5687-web-watermarked-2.jpg';
import img5729 from '../../assets/photos/bandits/IMG_5729-web-watermarked-2.jpg';
import img5836 from '../../assets/photos/bandits/IMG_5836-web-watermarked-2.jpg';
import img5947 from '../../assets/photos/bandits/IMG_5947-web-watermarked-2.jpg';
import img6204 from '../../assets/photos/bandits/IMG_6204-web-watermarked-2.jpg';

// Responsive srcSet imports (multiple widths, JPEG format)
import img0033SrcSet from '../../assets/photos/IMG_0033.jpg?w=480;768;1024;1500&format=jpg&as=srcset';
import img8298SrcSet from '../../assets/photos/IMG_8298.jpg?w=480;768;1024;1500&format=jpg&as=srcset';
import img8201SrcSet from '../../assets/photos/IMG_8201.jpg?w=480;768;1024;1600&format=jpg&as=srcset';
import img8259SrcSet from '../../assets/photos/IMG_8259.jpg?w=480;768;1024;1500&format=jpg&as=srcset';
import img8306SrcSet from '../../assets/photos/IMG_8306.jpg?w=480;768;1024;1500&format=jpg&as=srcset';
import img8320SrcSet from '../../assets/photos/IMG_8320.jpg?w=480;768;1024;1500&format=jpg&as=srcset';
import img6615SrcSet from '../../assets/photos/youth/IMG_6615.jpg?w=480;768;1024;1500&format=jpg&as=srcset';
import img6627SrcSet from '../../assets/photos/youth/IMG_6627.jpg?w=480;768;1024;1500&format=jpg&as=srcset';
import img7224SrcSet from '../../assets/photos/youth/IMG_7224.jpg?w=480;768;1024;1500&format=jpg&as=srcset';
import img7360SrcSet from '../../assets/photos/youth/IMG_7360.jpg?w=480;768;1024;1500&format=jpg&as=srcset';
import img7157SrcSet from '../../assets/photos/youth/IMG_7157.jpg?w=480;768;1024;1500&format=jpg&as=srcset';
import img4725SrcSet from '../../assets/photos/bandits/IMG_4725-web-watermarked-2.jpg?w=480;768;1024;2000&format=jpg&as=srcset';
import img4949SrcSet from '../../assets/photos/bandits/IMG_4949-web-watermarked-2.jpg?w=480;768;1024;1500&format=jpg&as=srcset';
import img4997SrcSet from '../../assets/photos/bandits/IMG_4997-web-watermarked-2.jpg?w=480;768;1024;1500&format=jpg&as=srcset';
import img5016SrcSet from '../../assets/photos/bandits/IMG_5016-web-watermarked-2.jpg?w=480;768;1024;2000&format=jpg&as=srcset';
import img5454SrcSet from '../../assets/photos/bandits/IMG_5454-web-watermarked-2.jpg?w=480;768;1024;1500&format=jpg&as=srcset';
import img5672SrcSet from '../../assets/photos/bandits/IMG_5672-web-watermarked-2.jpg?w=480;768;1024;1500&format=jpg&as=srcset';
import img5687SrcSet from '../../assets/photos/bandits/IMG_5687-web-watermarked-2.jpg?w=480;768;1024;2000&format=jpg&as=srcset';
import img5729SrcSet from '../../assets/photos/bandits/IMG_5729-web-watermarked-2.jpg?w=480;768;1024;1500&format=jpg&as=srcset';
import img5836SrcSet from '../../assets/photos/bandits/IMG_5836-web-watermarked-2.jpg?w=480;768;1024;2000&format=jpg&as=srcset';
import img5947SrcSet from '../../assets/photos/bandits/IMG_5947-web-watermarked-2.jpg?w=480;768;1024;1500&format=jpg&as=srcset';
import img6204SrcSet from '../../assets/photos/bandits/IMG_6204-web-watermarked-2.jpg?w=480;768;1024;1500&format=jpg&as=srcset';

const SIZES_GRID = '(max-width: 639px) 50vw, 33vw';
const SIZES_HERO = '100vw';


const featuredPhotos = [
  { src: img8298, srcSet: img8298SrcSet, alt: 'Portrait photo 1', width: 1500, height: 2000 },
  { src: img8306, srcSet: img8306SrcSet, alt: 'Portrait photo 2', width: 1500, height: 2000 },
  { src: img8320, srcSet: img8320SrcSet, alt: 'Portrait photo 3', width: 1500, height: 2000 },
  { src: img8259, srcSet: img8259SrcSet, alt: 'Portrait photo 4', width: 1500, height: 2000 },
  { src: img8201, srcSet: img8201SrcSet, alt: 'Portrait photo 5', width: 1600, height: 2000 },
];

const youthPhotos = [
  { src: img7360, srcSet: img7360SrcSet, alt: 'Youth photo 1', width: 1500, height: 2000 },
  { src: img7157, srcSet: img7157SrcSet, alt: 'Youth photo 2', width: 1500, height: 2000 },
  { src: img6615, srcSet: img6615SrcSet, alt: 'Youth photo 3', width: 1500, height: 2000 },
  { src: img6627, srcSet: img6627SrcSet, alt: 'Youth photo 4', width: 1500, height: 2000 },
  { src: img7224, srcSet: img7224SrcSet, alt: 'Youth photo 5', width: 1500, height: 2000 },
];

const banditsPhotos = [
  { src: img4725, srcSet: img4725SrcSet, alt: 'Bandits FC action shot', width: 2000, height: 1333 },
  { src: img4949, srcSet: img4949SrcSet, alt: 'Bandits FC player portrait', width: 1500, height: 2000 },
  { src: img4997, srcSet: img4997SrcSet, alt: 'Bandits FC match moment', width: 1500, height: 2000 },
  { src: img5016, srcSet: img5016SrcSet, alt: 'Bandits FC game highlight', width: 2000, height: 1333 },
  { src: img5454, srcSet: img5454SrcSet, alt: 'Bandits FC team play', width: 1500, height: 2000 },
  { src: img5672, srcSet: img5672SrcSet, alt: 'Bandits FC on the pitch', width: 1500, height: 2000 },
  { src: img5687, srcSet: img5687SrcSet, alt: 'Bandits FC wide angle', width: 2000, height: 1333 },
  { src: img5836, srcSet: img5836SrcSet, alt: 'Bandits FC match action', width: 2000, height: 1333 },
  { src: img5729, srcSet: img5729SrcSet, alt: 'Bandits FC player focus', width: 1500, height: 2000 },
  { src: img5947, srcSet: img5947SrcSet, alt: 'Bandits FC celebration', width: 1500, height: 2000 },
  { src: img6204, srcSet: img6204SrcSet, alt: 'Bandits FC final shot', width: 1500, height: 2000 },
];

const Photos = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

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
    <section className={styles.heroSection}>
      <div className={styles.photoCard}>
        <img
          src={img0033}
          srcSet={img0033SrcSet}
          sizes={SIZES_HERO}
          alt="Soccer match action shot"
          width={2000}
          height={1272}
          className={styles.photoImage}
        />
      </div>
      <div className={styles.heroContent}>
        <span className="text-overline">Explore</span>
        <h1 className="display">Photos</h1>
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
