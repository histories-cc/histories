import HeadProps from '@src/types/head';
import React from 'react';

import Main from './Main';

export interface IAuthLayoutProps {
  head: HeadProps;
  children: React.ReactNode;
}

const AuthLayout: React.FC<IAuthLayoutProps> = ({ head, children }) => {
  return (
    <Main head={head} background="bg-[#FAFCFE]">
      <main className="m-auto pt-8">{children}</main>
    </Main>
  );
};

export default AuthLayout;
