import type { Meta, StoryObj } from '@storybook/react-vite';
import TwinkleCanvas from './TwinkleCanvas';
import PhotoCard from '../../molecules/PhotoCard/PhotoCard';

const meta: Meta<typeof TwinkleCanvas> = {
  title: 'Atoms/TwinkleCanvas',
  component: TwinkleCanvas,
  tags: ['autodocs'],
  argTypes: {
    count: {
      control: { type: 'range', min: 5, max: 100, step: 1 },
      description: 'Number of twinkling lights',
    },
    regionHeight: {
      control: { type: 'range', min: 0.1, max: 1, step: 0.1 },
      description: 'Vertical fraction where lights appear (0–1)',
    },
    minRadius: {
      control: { type: 'range', min: 0.1, max: 3, step: 0.1 },
      description: 'Minimum light radius in px',
    },
    maxRadius: {
      control: { type: 'range', min: 0.5, max: 5, step: 0.1 },
      description: 'Maximum light radius in px',
    },
    minOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Minimum opacity',
    },
    maxOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Maximum opacity',
    },
    color: {
      control: 'object',
      description: 'RGB color as [r, g, b]',
    },
    shootingStars: {
      control: 'boolean',
      description: 'Enable shooting star effect',
    },
    shootingStarMinInterval: {
      control: { type: 'range', min: 1000, max: 60000, step: 1000 },
      description: 'Min interval between shooting stars (ms)',
    },
    shootingStarMaxInterval: {
      control: { type: 'range', min: 1000, max: 60000, step: 1000 },
      description: 'Max interval between shooting stars (ms)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TwinkleCanvas>;

export const Default: Story = {
  args: {
    count: 25,
    regionHeight: 0.5,
    minRadius: 0.4,
    maxRadius: 1,
    minOpacity: 0.1,
    maxOpacity: 0.35,
    color: [180, 180, 180],
    shootingStars: true,
    shootingStarMinInterval: 30000,
    shootingStarMaxInterval: 40000,
  },
  decorators: [
    (Story) => (
      <div
        style={{
          position: 'relative',
          width: 400,
          height: 300,
          background: '#111',
          borderRadius: '1rem',
          overflow: 'hidden',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export const WithPhotoCard: Story = {
  args: {
    count: 25,
    regionHeight: 0.5,
  },
  render: (args) => (
    <div style={{ position: 'relative', width: 350, height: 450 }}>
      <PhotoCard
        image="https://picsum.photos/seed/twinkle/700/900"
        alt="Sample photo with twinkle overlay"
        width={700}
        height={900}
        className=""
      />
      <TwinkleCanvas {...args} />
    </div>
  ),
};

export const ShootingStarPreview: Story = {
  args: {
    count: 25,
    regionHeight: 0.5,
    shootingStars: true,
    shootingStarMinInterval: 3000,
    shootingStarMaxInterval: 6000,
  },
  decorators: [
    (Story) => (
      <div
        style={{
          position: 'relative',
          width: 600,
          height: 400,
          background: '#0a0a0a',
          borderRadius: '1rem',
          overflow: 'hidden',
        }}
      >
        <Story />
      </div>
    ),
  ],
};
