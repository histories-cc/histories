import React from 'react';

export type BannerProps = { text: string };

const Banner: React.FC<BannerProps> = ({ text }) => {
  return (
    <span className="px-3 text-white bg-blue-400 rounded-full py-1.5">
      {text}
    </span>
  );
};

export default Banner;
