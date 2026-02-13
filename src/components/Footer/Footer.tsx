import type { FC } from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';
import containerStyles from '../../styles/modules/container.module.css';
import Pill from '../Pill/Pill';

const Footer: FC = () => (
  <footer className={styles.footer}>
    <div className={`${containerStyles.container} ${containerStyles.reverseGradient} ${styles.footerContent}`}>
      <div className={styles.ctaSection}>
        <span className="overline text-center text-secondary mb-4">Project in mind?</span>
        <h2 className="title2 text-center mb-8 text-secondary ">
          Let's Collaborate
        </h2>
        <Link to="/contact" className={`${styles.ctaButton} mt-8`}>
          Get in touch
        </Link>
      </div>
      <div className={styles.footnoteWrapper}>
        <Pill variant="primary" showBorder={false}>
          <p className="text-center text-sm">
            Built with passion & love by <span className="text-primary">Ashu Jainvi</span>
          </p>
        </Pill>
      </div>
    </div>
  </footer>
);

export default Footer;
