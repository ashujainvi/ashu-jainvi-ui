import styles from './Photos.module.css';

const Photos = () => (
  <div className={styles.photos}>
    <section className={styles.heroSection}>
      <div className={styles.photoCard}>
        <img
          src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1920&q=80"
          alt="Soccer match action shot"
          className={styles.photoImage}
        />
      </div>
      <div className={styles.heroContent}>
        <span className="text-overline">Explore</span>
        <h1 className="display">Photos</h1>
      </div>
    </section>
  </div>
);

export default Photos;
