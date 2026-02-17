import Card from '../../molecules/Card/Card';
import Button from '../../atoms/Button/Button';

interface FeatureCardProps {
  title: string;
  caption: string;
  linkText?: string;
  linkHref?: string;
  imageUrl?: string;
  shape?: 'ellipse' | 'rectangle';
}

const FeatureCard = ({ title, caption, linkText, linkHref, imageUrl, shape = 'rectangle' }: FeatureCardProps) => (
  <Card shape={shape}>
    <div className='flex flex-col items-center gap-4'>
      {imageUrl && (
        <img src={imageUrl} alt={title} className="mt-2 w-22 h-20 object-contain p-1" />
      )}
      <h4 className="title4">{title}</h4>
      <p className="text-center">{caption}</p>

      {linkText && linkHref && (
        <Button as="a" href={linkHref} variant="primary">
          {linkText}
        </Button>
      )}
    </div>
  </Card>
);

export default FeatureCard;
