import type { FC } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Footer.module.css';
import containerStyles from '../../styles/modules/container.module.css';
import Pill from '../../atoms/Pill/Pill';
import Button from '../../atoms/Button/Button';

const CTA_ROUTES = ['/', '/about'];

const Footer: FC = () => {
  const { pathname } = useLocation();
  const showCta = CTA_ROUTES.includes(pathname);

  if (showCta) {
    return (
      <footer className={styles.footer}>
        <div
          className={`${containerStyles.container} ${containerStyles.reverseGradient}`}
        >
          <div className={styles.ctaSection}>
            <span className="text-overline mb-4">Project in mind?</span>
            <h2 className="title2 mb-8">Let's Collaborate</h2>
            <Button
              as="link"
              to="/contact"
              variant="secondary"
              className="mt-8"
            >
              Get in touch
            </Button>
          </div>
          <div className={styles.footnoteWrapper}>
            <Pill variant="primary" showBorder={false}>
              <p className="text-center text-xs md:text-sm text-neutral-400">
                Built with passion & love by{' '}
                <span className="text-primary">Ashu Jainvi</span>
              </p>
            </Pill>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className={styles.footerMuted}>
      <div className={styles.footnoteWrapperMuted}>
        <Pill variant="primary" showBorder={false}>
          <p className="text-center text-xs md:text-sm text-neutral-400">
            Built with passion & love by{' '}
            <span className="text-primary">Ashu Jainvi</span>
          </p>
        </Pill>
      </div>
    </footer>
  );
};

export default Footer;
