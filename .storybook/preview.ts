import type { Preview } from 'storybook';

const preview: Preview = {
  parameters: {
    chromatic: { viewports: [320, 768, 1024] },
    a11y: {
      element: '#root',
    },
  },
};

export default preview;
