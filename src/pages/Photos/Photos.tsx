import styles from './Photos.module.css';
import PhotoCard from '../../molecules/PhotoCard/PhotoCard';
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


const featuredPhotos = [
  { src: img8298, alt: 'Portrait photo 1', width: 1500, height: 2000 },
  { src: img8306, alt: 'Portrait photo 2', width: 1500, height: 2000 },
  { src: img8320, alt: 'Portrait photo 3', width: 1500, height: 2000 },
  { src: img8259, alt: 'Portrait photo 4', width: 1500, height: 2000 },
  { src: img8201, alt: 'Portrait photo 5', width: 1600, height: 2000 },
];

const youthPhotos = [
  { src: img7360, alt: 'Youth photo 1', width: 1500, height: 2000 },
  { src: img7157, alt: 'Youth photo 2', width: 1500, height: 2000 },
  { src: img6615, alt: 'Youth photo 3', width: 1500, height: 2000 },
  { src: img6627, alt: 'Youth photo 4', width: 1500, height: 2000 },
  { src: img7224, alt: 'Youth photo 5', width: 1500, height: 2000 },
];

const banditsPhotos = [
  { src: img4725, alt: 'Bandits FC action shot', width: 2000, height: 1333 },
  { src: img4949, alt: 'Bandits FC player portrait', width: 1500, height: 2000 },
  { src: img4997, alt: 'Bandits FC match moment', width: 1500, height: 2000 },
  { src: img5016, alt: 'Bandits FC game highlight', width: 2000, height: 1333 },
  { src: img5454, alt: 'Bandits FC team play', width: 1500, height: 2000 },
  { src: img5672, alt: 'Bandits FC on the pitch', width: 1500, height: 2000 },
  { src: img5687, alt: 'Bandits FC wide angle', width: 2000, height: 1333 },
  { src: img5836, alt: 'Bandits FC match action', width: 2000, height: 1333 },
  { src: img5729, alt: 'Bandits FC player focus', width: 1500, height: 2000 },
  { src: img5947, alt: 'Bandits FC celebration', width: 1500, height: 2000 },
  { src: img6204, alt: 'Bandits FC final shot', width: 1500, height: 2000 },
];

const Photos = () => (
  <div className={styles.photos}>
    <section className={styles.heroSection}>
      <div className={styles.photoCard}>
        <img
          src={img0033}
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
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            className={styles.featuredCard}
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
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            className={styles.banditsCard}
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
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            className={styles.featuredCard}
          />
        ))}
      </div>
    </section>
  </div>
);

export default Photos;
