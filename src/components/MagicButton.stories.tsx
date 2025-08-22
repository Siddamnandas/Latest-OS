import type { Meta, StoryObj } from '@storybook/react';
import { MagicButton } from './MagicButton';

const meta: Meta<typeof MagicButton> = {
  title: 'Components/MagicButton',
  component: MagicButton,
  parameters: {
    docs: {
      description: {
        component: 'Provides sparkling visual feedback while retaining accessible button semantics.',
      },
    },
  },
};

export default meta;

export const Default: StoryObj<typeof MagicButton> = {
  args: {
    children: 'Activate magic',
  },
  parameters: {
    docs: {
      description: {
        story: 'Use descriptive text so screen readers understand the button\'s purpose.',
      },
    },
  },
};