import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Profile as ProfileComponent, ProfileStats } from './index';

export default {
  title: 'Molecules/Profile',
  component: ProfileStats,
} as ComponentMeta<typeof ProfileStats>;

const Template: ComponentStory<typeof ProfileStats> = (args) => (
  <ProfileStats {...args} />
);

export const Stats = Template.bind({});
Stats.args = {
  followers: 20,
  following: 16,
  posts: 4,
};

const ProfileTemplate: ComponentStory<typeof ProfileComponent> = (args) => (
  <ProfileComponent {...args} />
);

export const Profile = ProfileTemplate.bind({});
Profile.args = {
  firstName: 'John',
  lastName: 'Doe',
  username: 'johnDoe69',
  loading: false,
  followers: 20,
  following: 16,
  posts: 4,
};
