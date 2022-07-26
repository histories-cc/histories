import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { HeadingsList } from './lists';

export default {
  title: 'Elements/Headings',
  component: HeadingsList,
} as ComponentMeta<typeof HeadingsList>;

const Template: ComponentStory<typeof HeadingsList> = (args) => (
  <HeadingsList {...args} />
);

export const All = Template.bind({});
All.args = {
  showSizes: true,
  text: 'The quick brown fox jumps over the lazy dog.',
};
