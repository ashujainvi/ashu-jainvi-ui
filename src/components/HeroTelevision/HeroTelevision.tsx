import { useId, useState, type CSSProperties } from 'react';
import HeroBackground from '../HeroBackground/HeroBackground';
import styles from './HeroTelevision.module.css';

const receptionModes = [
  { label: 'Clear', intensity: 0, angle: -50 },
  { label: 'Analog', intensity: 1, angle: 0 },
  { label: 'Static', intensity: 1.6, angle: 50 },
];

const HeroTelevision = () => {
  const [powered, setPowered] = useState(true);
  const [receptionIndex, setReceptionIndex] = useState(1);
  const reception = receptionModes[receptionIndex];
  const descriptionId = useId();

  return (
    <div className={styles.television} data-hero-tv>
      <div className={styles.screenSurround}>
        <div className={styles.screen}>
          <HeroBackground enabled={powered} intensity={reception.intensity}>
            <div className={styles.broadcast}>
              <div className={styles.screenHeader}>
                <span>AJ — 01</span>
                <span>Austin, TX</span>
              </div>
              <div className={styles.identity}>
                <span className={styles.meet}>Meet</span>
                <h1 id="hero-title" className={styles.title}>
                  <span>Ashu</span> <span>Jainvi</span>
                </h1>
              </div>
              <p className={styles.screenFooter}>
                Visual artist &amp; engineer
              </p>
            </div>
          </HeroBackground>
        </div>
      </div>

      <div className={styles.controls} role="group" aria-label="TV controls">
        <div className={styles.controlPanel}>
          <span className={styles.brand} aria-hidden="true">
            AJ.
          </span>

          <div className={styles.control}>
            <span className={styles.label} aria-hidden="true">
              Power
            </span>
            <button
              type="button"
              className={styles.powerButton}
              aria-label="TV power"
              aria-pressed={powered}
              onClick={() => setPowered((value) => !value)}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M12 3v9M7 5.5a8 8 0 1 0 10 0" />
              </svg>
            </button>
            <span
              className={styles.powerStatus}
              data-on={powered}
              aria-hidden="true"
            >
              {powered ? 'On air' : 'Standby'}
            </span>
          </div>

          <div className={styles.control}>
            <span className={styles.label} aria-hidden="true">
              Reception
            </span>
            <button
              type="button"
              className={styles.dial}
              aria-label="Change reception"
              aria-describedby={descriptionId}
              disabled={!powered}
              onClick={() =>
                setReceptionIndex(
                  (index) => (index + 1) % receptionModes.length,
                )
              }
              style={
                { '--dial-angle': `${reception.angle}deg` } as CSSProperties
              }
            >
              <span className={styles.dialPointer} aria-hidden="true" />
            </button>
            <span className={styles.receptionValue} aria-live="polite">
              {reception.label}
            </span>
            <span id={descriptionId} className={styles.srOnly}>
              {reception.label} reception. Press to cycle through Clear, Analog,
              and Static.
            </span>
          </div>
        </div>

        <div className={styles.speaker} aria-hidden="true" />
      </div>
    </div>
  );
};

export default HeroTelevision;
