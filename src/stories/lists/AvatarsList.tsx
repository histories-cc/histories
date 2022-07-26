import React from 'react';
import { Avatar } from '../../components/elements';

interface IHeadingsProps {
  loading?: boolean;
  src?: string;
}

const HeadingsList: React.FC<IHeadingsProps> = ({
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

export default HeadingsList;
