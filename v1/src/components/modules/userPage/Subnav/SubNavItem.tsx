import Link from 'next/link';
import React from 'react';

export type UserSubNavItemProps = {
  href: string;
  name: string;
  currentTab: string;
};

const UserSubNavItem: React.FC<UserSubNavItemProps> = ({
  children,
  href,
  name,
  currentTab,
}) => {
  return (
    <Link href={href}>
      <a
        className={`flex items-center px-3 py-2 font-bold ${
          currentTab === name
            ? 'bg-brand text-white'
            : 'hover:bg-zinc-200 text-zinc-500'
        } rounded-lg gap-1 space-x-2`}
      >
        {children}
      </a>
    </Link>
  );
};

export default UserSubNavItem;
