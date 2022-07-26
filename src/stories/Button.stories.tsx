import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Button } from '../components/elements';

export default {
  title: 'Elements/Button',
  component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

const defaultValues = {
  disabled: false,
  children: 'Button',
};

export const Primary = Template.bind({});
Primary.args = {
  ...defaultValues,
  variant: 'primary',
};

export const Secondary = Template.bind({});
Secondary.args = {
  ...defaultValues,
  variant: 'secondary',
};

export const Tertiary = Template.bind({});
Tertiary.args = {
  ...defaultValues,
  variant: 'tertiary',
};
