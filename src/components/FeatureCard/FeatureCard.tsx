import Card from '../Card/Card';
import Pill from '../Pill/Pill';

interface FeatureCardProps {
  title: string;
  caption: string;
  linkText?: string;
  imageUrl?: string;
  shape?: 'ellipse' | 'rectangle';
}

const FeatureCard = ({ title, caption, linkText, imageUrl, shape = 'rectangle' }: FeatureCardProps) => (
  <Card shape={shape}>
    <div className='flex flex-col items-center gap-4'>
      {imageUrl && (
        <img src={imageUrl} alt={title} className="mt-2 w-22 h-20 object-contain p-1" />
      )}
      <h4 className="title4 text-primary">{title}</h4>
      <p className="text-center">{caption}</p>

      {linkText && (
        <Pill>
          <span className="text-secondary">{linkText}</span>
        </Pill>
      )}
    </div>
  </Card>
);

export default FeatureCard;
