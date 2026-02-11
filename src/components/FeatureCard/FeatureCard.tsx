import Card from '../Card/Card';
import Pill from '../Pill/Pill';

interface FeatureCardProps {
  title: string;
  caption: string;
  linkText?: string;
}

const FeatureCard = ({ title, caption, linkText }: FeatureCardProps) => (
  <Card>
    <h4 className="title4 text-primary">{title}</h4>
    <p className="caption">{caption}</p>

    {linkText && (
      <Pill>
        <span className="text-secondary">{linkText}</span>
      </Pill>
    )}
  </Card>
);

export default FeatureCard;
