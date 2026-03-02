import type { Meta, StoryObj } from '@storybook/react-vite';
import Pill from './Pill';

const meta: Meta<typeof Pill> = {
  title: 'Atoms/Pill',
  component: Pill,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
      description: 'Pill color variant',
    },
    showBorder: {
      control: 'boolean',
      description: 'Show or hide the border',
    },
    children: {
      control: 'text',
      description: 'Pill content',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Pill>;

export const Primary: Story = {
  args: {
    children: 'Photography',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Videography',
    variant: 'secondary',
  },
};

export const NoBorder: Story = {
  args: {
    children: 'Subtle Label',
    variant: 'primary',
    showBorder: false,
  },
};
