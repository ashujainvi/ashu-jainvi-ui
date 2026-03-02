import type { FC, ReactNode } from 'react';
import styles from './PageHero.module.css';

interface PageHeroProps {
  overline: string;
  title: string;
  children: ReactNode;
}

const PageHero: FC<PageHeroProps> = ({ overline, title, children }) => (
  <div className={styles.page}>
    <section className={styles.heroSection}>
      <span className="text-overline">{overline}</span>
      <h1 className="display">{title}</h1>
    </section>
    {children}
  </div>
);

export default PageHero;
