import styles from './Home.module.css';
import heroBorder from '../../assets/hero-mask.svg';
import heroSoccerAshu from '../../assets/hero-soccer-ashu.svg';
import cloudImage from '../../assets/cloud.svg';
import sunImage from '../../assets/sun.png';
import brushEffectImage from '../../assets/brush-effect.png';
import Pill from '../../components/Pill/Pill';
import FeatureCard from '../../components/FeatureCard/FeatureCard';
import MeetSvg from '../../components/MeetSvg/MeetSvg';

const Home = () => (
  <div className={styles.Home}>
    <section className={styles.heroSection}>
      <div className={styles.heroContainer}>
        <img
          src={heroBorder}
          alt="Hero Wave Border"
          className={styles.heroBorder}
        />
        <div className={styles.heroScene}>
          <div className={styles.heroSkyContainer}>
            <div className={styles.heroMeet}>
              <MeetSvg />
            </div>
            <img src={sunImage} className={styles.heroSun} alt="sun" />
            <img src={cloudImage} className={styles.heroCloud} alt="cloud" />
          </div>

          <div className={styles.heroGroundContainer}>
            <img
              src={heroSoccerAshu}
              className={styles.heroSoccerAshu}
              alt="Hero soccer player - Ashu"
            />
            <Pill variant="primary">
              <h1 className="title3 color-primary">Ashu Jainvi</h1>
            </Pill>
            <img
              src={brushEffectImage}
              className={styles.heroBrushEffect}
              alt="Hero brush effect"
            />
          </div>
        </div>
      </div>
    </section>
    <section className={styles.craftSection}>
      <div className={styles.craftContainer}>
        <h2 className="title2 color-secondary marginBottomSmall">
          Austin, Texas based
        </h2>
        <h2 className="title1 color-black marginBottomSmall">
          Digital Artist <br />
          <span className="textSmall">&</span> Web Developer
        </h2>
        <Pill variant="primary">
          <p className="caption color-tertiary textAlignLeft">
            I build expressive digital worlds through imagination and execution.
          </p>
        </Pill>
      </div>
    </section>
    <section className={styles.discoverSection}>
      <div className={styles.discoverContainer}>
        <h3 className="title1 color-primary marginBottomMedium textAlignCenter">
          Discover my craft
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
