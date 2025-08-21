import type { StorybookConfig } from 'storybook';

const config: StorybookConfig = {
  stories: ['../src/components/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-viewport'],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
};

export default config;
