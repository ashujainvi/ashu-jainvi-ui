/* eslint-disable */
import FeatureCard from './FeatureCard';

export default {
  title: "FeatureCard",
};

export const Default = () => (
  <FeatureCard 
    title="Sample Title" 
    caption="Sample caption text" 
  />
);

Default.story = {
  name: 'default',
};
