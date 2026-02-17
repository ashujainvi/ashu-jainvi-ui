import type { FC } from 'react';
import styles from './Footer.module.css';
import containerStyles from '../../styles/modules/container.module.css';
import Pill from '../../atoms/Pill/Pill';
import Button from '../../atoms/Button/Button';

const Footer: FC = () => (
  <footer className={styles.footer}>
    <div className={`${containerStyles.container} ${containerStyles.reverseGradient}`}>
      <div className={styles.ctaSection}>
        <span className="text-overline mb-4">Project in mind?</span>
        <h2 className="title2 mb-8">
          Let's Collaborate
        </h2>
        <Button as="a" href="/contact" variant="secondary" className="mt-8">
          Get in touch
        </Button>
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
