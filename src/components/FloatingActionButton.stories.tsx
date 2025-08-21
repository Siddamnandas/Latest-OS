import type { Meta, StoryObj } from '@storybook/react';
import { FloatingActionButton } from './FloatingActionButton';

const meta: Meta<typeof FloatingActionButton> = {
  title: 'Components/FloatingActionButton',
  component: FloatingActionButton,
  parameters: {
    docs: {
      description: {
        component: 'Uses aria-labels on the button to ensure screen reader accessibility for quick actions.',
      },
    },
  },
};

export default meta;

export const Default: StoryObj<typeof FloatingActionButton> = {
  render: () => <FloatingActionButton />,
  parameters: {
    chromatic: { viewports: [320, 768, 1024] },
  },
};
