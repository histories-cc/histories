import React from 'react';

import Main from './Main';

export interface IAuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<IAuthLayoutProps> = ({ children }) => {
  return (
    <Main background="bg-[#FAFCFE]">
      <main className="m-auto pt-8">{children}</main>
    </Main>
  );
};

export default AuthLayout;
