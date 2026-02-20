import styles from './Home.module.css';
import containerStyles from '../../styles/modules/container.module.css';
import Pill from '../../atoms/Pill/Pill';
import FeatureCard from '../../organisms/FeatureCard/FeatureCard';
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
          <span className={`text-overline ${styles.stroke}`}>
            Meet
          </span>
          <h1 className="display">Ashu Jainvi</h1>
        </div>
      </div>
    </section>
    <section className={styles.craftSection}>
      <div className={containerStyles.container}>
        <span className="text-overline text-primary-darker">
          Austin, Texas based
        </span>
        <h2 className="title1">
          Visual Artist
        </h2>
        <div className="mt-10 mx-auto w-[240px]">
          <img src={desktopSvg} alt="Desktop Illustration" className="mx-auto" />
        </div>
        <div className="mb-36">
          <Pill variant="primary" showBorder={false}>
            <p className="caption">
              Who builds clean yet playful digital worlds through photography, graphics,
              and web design.
            </p>
          </Pill>
        </div>

      </div>
    </section>
    <section className={styles.discoverSection}>
      <div className={styles.discoverContainer}>
        <span className={`text-overline ${styles.stroke}`}>
          Discover
        </span>
        <h3 className="title2 text-secondary-light">My craft</h3>
        <div className="@container w-full mt-22">
          <div className="grid @md:grid-cols-1 @lg:grid-cols-2 @4xl:grid-cols-3 gap-4 justify-items-center">
            <div className="w-full flex justify-center">
              <FeatureCard
                title={'Photography'}
                caption={
                  'Artistic portrait photos taken over the years'
                }
                linkText="View Portfolio"
                linkHref="/photos"
                imageUrl={cameraOutlinePng}
              />
            </div>
            <div className="w-full flex justify-center">
              <FeatureCard
                title={'Graphics'}
                caption={
                  'Curated branding for your needs'
                }
                imageUrl={penToolOutlinePng}
              />
            </div>
            <div className="w-full flex justify-center">
              <FeatureCard
                title={'Web Design'}
                caption={
                  'Curated web design for your needs'
                }
                imageUrl={browserWindowOutlinePng}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default Home;
