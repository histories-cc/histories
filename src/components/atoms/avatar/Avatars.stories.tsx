import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Avatar } from '..';

interface IAvatarsList {
  loading?: boolean;
  src?: string;
}

const AvatarsList: React.FC<IAvatarsList> = ({
  loading,
  src = 'https://i.pravatar.cc',
}) => {
  const sizes = ['4xl', '3xl', '2xl', 'xl', 'lg', 'md'];

  return (
    <div className="flex gap-4 items-center">
      {sizes.map((size, index) => {
        return (
          <Avatar
            src={src == '' ? 'https://i.pravatar.cc' : src}
            // @ts-ignore
            size={size}
            key={index}
            loading={loading}
          />
        );
      })}
    </div>
  );
};

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
