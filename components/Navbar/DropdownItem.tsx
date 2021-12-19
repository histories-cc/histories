import Link from 'next/link';
import React from 'react';

const DropdownItem: React.FC<{
  text: string;
  bottom?: boolean;
  top?: boolean;
  href?: string;
  onClick?: () => void;
}> = ({ text, bottom, top, href, onClick }) => {
  const component = (
    <a
      className={`px-4 flex py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer leading-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 font-medium text-sm ${
        !bottom
          ? 'border-b border-gray-200 dark:border-gray-800'
          : 'rounded-b-lg'
      } ${top ? 'rounded-t-lg' : ''}`}
      onClick={onClick}
    >
      {text}
    </a>
  );

  return href ? <Link href={href}>{component}</Link> : component;
};

export default DropdownItem;
