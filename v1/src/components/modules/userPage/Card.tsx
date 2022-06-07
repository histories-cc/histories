import React from 'react';

export type CardProps = {
  warning?: boolean;
};

const Card: React.FC<CardProps> = ({ warning, children }) => {
  return (
    <span>
      <div
        className={`${
          warning ? 'bg-red-200 border-red-400 text-red-800' : 'bg-white'
        } border dark:border-[#373638] dark:bg-[#2b2b2b] lg:rounded-lg md:rounded-lg sm:rounded-lg shadow-sm dark:shadow-md`}
      >
        <div className="p-5 ">
          <div className="grid justify-items-center space-y-2">{children}</div>
        </div>
      </div>
    </span>
  );
};

export default Card;
