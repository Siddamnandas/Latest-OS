import type { Preview } from 'storybook';

const preview: Preview = {
  parameters: {
    chromatic: { viewports: [320, 768, 1024] },
  },
};

export default preview;
