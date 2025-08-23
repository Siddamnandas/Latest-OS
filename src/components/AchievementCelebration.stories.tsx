import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { AchievementCelebration } from './AchievementCelebration';

const meta: Meta<typeof AchievementCelebration> = {
  title: 'Components/AchievementCelebration',
  component: AchievementCelebration,
  parameters: {
    docs: {
      description: {
        component: 'Full-screen celebration modal. Ensure focus is returned to the trigger element and the close button is labelled.',
      },
    },
  },
};

export default meta;

export const Default: StoryObj<typeof AchievementCelebration> = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <AchievementCelebration
        isOpen={open}
        onClose={() => setOpen(false)}
        achievement={{
          title: 'Milestone Reached',
          description: 'You completed your first challenge!',
          icon: '🏆',
          rarity: 'epic',
          coins: 100,
        }}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'When the modal opens, focus should be trapped inside and the close button is keyboard accessible.',
      },
    },
  },
};