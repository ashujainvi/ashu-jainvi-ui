import styles from './Home.module.css';
import containerStyles from '../../styles/modules/container.module.css';
import Pill from '../../components/Pill/Pill';
import FeatureCard from '../../components/FeatureCard/FeatureCard';
import desktopSvg from '../../assets/desktop.svg';
import glitchPng from '../../assets/glitch.png';
import cameraOutlinePng from '../../assets/camera-outline.png';
import penToolOutlinePng from '../../assets/pen-tool-outline.png';
import browserWindowOutlinePng from '../../assets/browser-window-outline.png';

const Home = () => (
  <div className={styles.home}>
    <div
      className={styles.backgroundWrapper}
      style={{ backgroundImage: `url(${glitchPng})` }}></div>
    <section className={styles.heroSection}>
      <div className={styles.heroContainer}>
        <div className={`${styles.heroScene} text-center`}>
          <span className={`overline text-secondary ${styles.stroke}`}>
            Meet
          </span>
          <h1 className="display text-primary text-center">Ashu Jainvi</h1>
        </div>
      </div>
    </section>
    <section className={styles.craftSection}>
      <div className={containerStyles.container}>
        <h2 className="text-secondary text-center overline">
          Austin, Texas based
        </h2>
        <h2 className="title2 mb-6 text-secondary text-center">
          Visual Artist
        </h2>
        <div className="mt-10 mx-auto w-[240px]">
          <img src={desktopSvg} alt="Desktop Illustration" className="mx-auto" />
        </div>
        <Pill variant="primary" showBorder={false}>
          <p className="caption text-secondary">
            Who builds expressive digital worlds through photography, graphics,
            and web design.
          </p>
        </Pill>
      </div>
    </section>
    <section className={styles.discoverSection}>
      <div className={styles.discoverContainer}>
        <span className={`overline text-secondary ${styles.stroke}`}>
          Discover
        </span>
        <h3 className="title2 text-primary">My craft</h3>
        <div className="flex flex-col lg:flex-row lg:flex-wrap justify-center items-center mt-10 gap-6">
          <FeatureCard
            title={'Photography'}
            caption={
              'From sports to portraits, I capture moments with a story.'
            }
            linkText="View Portfolio"
            imageUrl={cameraOutlinePng}
          />
          <FeatureCard
            title={'Graphics'}
            shape='ellipse'
            caption={
              'From branding to poster designs. I like to design eclectic stuff.'
            }
            imageUrl={penToolOutlinePng}
          />
          <FeatureCard
            title={'Web Design'}
            caption={
              'From branding to poster designs. I like to design eclectic stuff.'
            }
            imageUrl={browserWindowOutlinePng}
          />
        </div>
      </div>
    </section>
  </div>
);

export default Home;
