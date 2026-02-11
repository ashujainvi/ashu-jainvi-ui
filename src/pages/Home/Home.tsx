import styles from './Home.module.css';
import Pill from '../../components/Pill/Pill';
import FeatureCard from '../../components/FeatureCard/FeatureCard';
import desktopSvg from '../../assets/desktop.svg';
import glitchPng from '../../assets/glitch.png';

const Home = () => (
  <div className={styles.home}>
    <div className={styles.backgroundWrapper} style={{ backgroundImage: `url(${glitchPng})` }}></div>
    <section className={styles.heroSection}>
      <div className={styles.heroContainer}>
        <div className={`${styles.heroScene} mt-20 text-center`}>
          <span className={`caption text-secondary ${styles.meetCaption}`}>Meet</span>
          <h1 className="title1 text-primary text-center">
            Ashu Jainvi
          </h1>
        </div>
      </div>
    </section>
    <section className={styles.craftSection}>
      <div className={`${styles.craftContainer} md:rounded-5xl rounded-4xl p-8 items-center`}>
        <h2 className="text-secondary text-center caption">
          Austin, Texas based
        </h2>
        <h2 className="title2 mb-6 text-secondary text-center">Visual Artist </h2>
        <div className="mt-10 mx-auto" style={{ width: '240px' }}>
          <img src={desktopSvg} alt="Desktop" className="mx-auto" />
        </div>
        <Pill variant="primary">
          <p className="caption text-secondary">
          Who builds expressive digital worlds through photography, graphics, and web design.
          </p>
        </Pill>
      </div>
    </section>
    <section className={styles.discoverSection}>
      <div className={styles.discoverContainer}>
        <h3 className="title2 text-primary">
          My craft
        </h3>
        <div className={styles.discoverCards}>
          <FeatureCard
            title={'Photography'}
            caption={
              'From sports to portraits, I capture moments with a story.'
            }
            linkText="View Portfolio"
          />
          <FeatureCard
            title={'Graphics'}
            caption={
              'From branding to poster designs. I like to design eclectic stuff.'
            }
          />
          <FeatureCard
            title={'Web Design'}
            caption={
              'From branding to poster designs. I like to design eclectic stuff.'
            }
          />
        </div>
      </div>
    </section>
  </div>
);

export default Home;
