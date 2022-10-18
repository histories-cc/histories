import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

interface IHeadingsProps {
  showSizes?: boolean;
  text: string;
}

const HeadingsList: React.FC<IHeadingsProps> = ({ showSizes, text }) => {
  return (
    <div>
      <h1>{`${showSizes ? 'H1 - ' : ''}${text}`}</h1>
      <h2>{`${showSizes ? 'H2 - ' : ''}${text}`}</h2>
      <h3>{`${showSizes ? 'H3 - ' : ''}${text}`}</h3>
      <h4>{`${showSizes ? 'H4 - ' : ''}${text}`}</h4>
      <h5>{`${showSizes ? 'H5 - ' : ''}${text}`}</h5>
      <h6>{`${showSizes ? 'H6 - ' : ''}${text}`}</h6>
    </div>
  );
};

export default {
  title: 'Atoms/Headings',
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
