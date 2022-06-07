import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  HiFolderOpen,
  HiOutlineCollection,
  HiOutlineMap,
} from 'react-icons/hi';

import UserSubNavItem from './SubNavItem';

export type UserSubNavProps = {
  currentTab: 'posts' | 'collections' | 'map';
  user: { username: string; firstName: string; id: number };
};

const SubNav: React.FC<UserSubNavProps> = ({ currentTab, user }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center w-full px-2 pt-2 md:justify-between transition-all duration-500 ease-in-out">
      <div className="flex flex-wrap sm:gap-3 gap-5">
        <UserSubNavItem
          href={`/user/${user.username}`}
          currentTab={currentTab}
          name="posts"
        >
          <HiOutlineCollection className="w-6 h-6" />
          <span className="hidden md:block">{t('posts')}</span>
        </UserSubNavItem>
        <UserSubNavItem
          href={`/user/${user.username}/collections`}
          currentTab={currentTab}
          name="collections"
        >
          <HiFolderOpen className="w-6 h-6" />
          <span className="hidden md:block">{t('collections')}</span>
        </UserSubNavItem>
        <UserSubNavItem
          href={`/user/${user.username}/map`}
          currentTab={currentTab}
          name="map"
        >
          <HiOutlineMap className="w-6 h-6" />
          <span className="hidden md:block">
            {`${user.firstName}'s ${t('map')}`}
          </span>
        </UserSubNavItem>
      </div>
    </div>
  );
};

export default SubNav;
