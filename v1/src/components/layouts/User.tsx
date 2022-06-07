import { LeftPanel } from '@components/modules/userPage/LeftPanel';
import { SubNav } from '@components/modules/userPage/Subnav';
import HeadProps from '@src/types/head';
import React from 'react';

import { Layout } from '.';

type UserLayoutProps = {
  user: any;
  currentTab: 'posts' | 'collections' | 'map';
  head: HeadProps;
  heading: string;
};

const UserLayout: React.FC<UserLayoutProps> = ({
  head,
  user,
  currentTab,
  children,
  heading,
}) => {
  return (
    <Layout head={head}>
      <div className="pt-16 m-auto grid grid-cols-12 lg:gap-8 max-w-screen-2xl gap-6 h-[calc(100vh - 300px)]">
        <LeftPanel user={user} />
        <div className="h-full lg:col-start-5 lg:col-span-4 md:col-start-5 col-span-full space-y-2">
          {/* SUBNAV */}
          <SubNav currentTab={currentTab} user={user} />
          <main className="w-full" style={{ height: 'calc(100vh - 400px)' }}>
            {children}
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default UserLayout;
