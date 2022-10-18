import React from 'react';
import Image from 'next/image';

interface IAvatarProps {
  src: string;
  size?: '4xl' | '3xl' | '2xl' | 'xl' | 'lg' | 'md';
  loading?: boolean;
}

const Avatar: React.FC<IAvatarProps> = ({
  src,
  size: argSize = 'md',
  loading,
}) => {
  const sizes = {
    '4xl': '200px',
    '3xl': '160px',
    '2xl': '120px',
    xl: '80px',
    lg: '60px',
    md: '40px',
  };

  const size = sizes[argSize];

  if (loading) {
    return (
      <div
        style={{
          height: size,
          width: size,
        }}
        className="rounded-full bg-disabled animate-pulse"
      />
    );
  } else {
    return (
      <div
        style={{
          height: size,
          width: size,
        }}
        className="relative"
      >
        <Image
          src={src}
          style={{
            borderRadius: '50%',
          }}
          className="bg-disabled"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </div>
    );
  }
};

export default Avatar;
