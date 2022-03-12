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
    <div className="flex items-center justify-between w-full px-2 pt-2 transition-all duration-500 ease-in-out">
      <div className="flex flex-col flex-wrap sm:flex-row sm:gap-3 gap-5">
        <UserSubNavItem
          href={`/user/${user.username}`}
          currentTab={currentTab}
          name="posts"
        >
          <HiOutlineCollection />
          {t('posts')}
        </UserSubNavItem>
        <UserSubNavItem
          href={`/user/${user.username}/collections`}
          currentTab={currentTab}
          name="collections"
        >
          <HiFolderOpen className="w-4 h-4" />
          {t('collections')}
        </UserSubNavItem>
        <UserSubNavItem
          href={`/user/${user.username}/map`}
          currentTab={currentTab}
          name="map"
        >
          <HiOutlineMap className="w-5 h-5" />
          {`${user.firstName}'s ${t('map')}`}
        </UserSubNavItem>
      </div>
    </div>
  );
};

export default SubNav;
