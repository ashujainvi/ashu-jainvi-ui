import type { Preview } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

import '../src/index.css';
import '../src/styles/typography.css';

const preview: Preview = {
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
};

export default preview;