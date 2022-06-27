import MeContext from '@src/contexts/MeContext';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';

import Main from './Main';

export interface IAuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<IAuthLayoutProps> = ({ children }) => {
  // contexts
  const { loading, isLoggedIn } = useContext(MeContext);

  // hooks
  const router = useRouter();

  useEffect(() => {
    if (!loading && isLoggedIn) router.push('/');
  }, [loading]);

  return (
    <Main background="bg-[#FAFCFE]">
      <main className="m-auto pt-8">{children}</main>
    </Main>
  );
};

export default AuthLayout;
