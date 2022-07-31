import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AvatarsList } from './lists';

export default {
  title: 'Atoms/Avatars',
  component: AvatarsList,
} as ComponentMeta<typeof AvatarsList>;

const Template: ComponentStory<typeof AvatarsList> = (args) => (
  <AvatarsList {...args} />
);

export const All = Template.bind({});
All.args = {
  src: '',
  loading: false,
};
