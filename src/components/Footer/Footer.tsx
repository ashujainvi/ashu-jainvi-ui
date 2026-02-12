import type { FC } from 'react';
import styles from './Footer.module.css';
import containerStyles from '../../styles/modules/container.module.css';

const Footer: FC = () => (
  <footer className={styles.footer}>
    <div className={`${containerStyles.container} ${containerStyles.reverseGradient} ${styles.footerContent}`}>
      <p className="caption text-secondary text-center">
        © 2026 Ashu Jainvi. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
