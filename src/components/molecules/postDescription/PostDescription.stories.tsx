import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PostDescription as PostDescriptionComponent } from '../index';

export default {
  title: 'Molecules/Post/Description',
  component: PostDescriptionComponent,
} as ComponentMeta<typeof PostDescriptionComponent>;

const Template: ComponentStory<typeof PostDescriptionComponent> = (args) => (
  <div className="bg-light h-[80vh] p-10">
    <PostDescriptionComponent {...args} />
  </div>
);

export const Description = Template.bind({});
Description.args = {
  id: 'id',
  author: {
    firstName: 'Kryštof',
    lastName: 'Krátký',
    username: 'krystxf',
    profile: 'https://i.pravatar.cc',
  },
  createdAt: new Date(),
  iLike: false,
  likes: 32,
};
