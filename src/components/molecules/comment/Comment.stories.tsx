import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import CommentComponent from './Comment';

export default {
  title: 'Molecules/Post/Comment',
  component: CommentComponent,
} as ComponentMeta<typeof CommentComponent>;

const Template: ComponentStory<typeof CommentComponent> = (args) => (
  <CommentComponent {...args} />
);

export const Comment = Template.bind({});
Comment.args = {
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
