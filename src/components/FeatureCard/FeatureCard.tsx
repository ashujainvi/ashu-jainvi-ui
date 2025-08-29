import styles from './FeatureCard.module.css';
import Card from '../Card/Card';
import Pill from '../Pill/Pill';

interface FeatureCardProps {
  title: string;
  caption: string;
  linkText?: string;
}

const FeatureCard = ({ title, caption, linkText }: FeatureCardProps) => (
  <div className={styles.FeatureCard}>
    <Card>
      <h4 className="title4 color-primary marginBottomSmall">{title}</h4>
      <p className="caption marginBottomSmall">{caption}</p>

      {linkText && (
        <Pill>
          <span className="color-secondary fontFamilyPrimary">{linkText}</span>
        </Pill>
      )}
    </Card>
  </div>
);

export default FeatureCard;
