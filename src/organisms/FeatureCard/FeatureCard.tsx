import Card from '../../molecules/Card/Card';
import Button from '../../atoms/Button/Button';
import styles from './FeatureCard.module.css';

interface FeatureCardProps {
  title: string;
  caption: string;
  linkText?: string;
  linkHref?: string;
  imageUrl?: string;
}

const FeatureCard = ({ title, caption, linkText, linkHref, imageUrl }: FeatureCardProps) => (
  <Card>
    <div className='flex flex-col items-start'>
      {imageUrl && (
        <img src={imageUrl} alt={title} className={`w-12 h-12 object-contain mb-32 ${styles.icon}`} />
      )}
      <div className="flex flex-col gap-3 mb-8">
        <h4 className="title5">{title}</h4>
        <p className="text-left text-neutral-400">{caption}</p>
      </div>

      {linkText && linkHref && (
        <div>
          <Button as="link" to={linkHref} variant="primary">
            {linkText}
          </Button>
        </div>
      )}
    </div>
  </Card>
);

export default FeatureCard;
