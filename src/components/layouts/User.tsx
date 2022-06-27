import Navbar from '@components/modules/Navbar';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import { useUserQuery } from '@graphql';
import UserContext from '@src/contexts/UserContext';

interface MainLayoutProps {
  children: React.ReactNode;
  username: string;
}

const UserLayout: React.FC<MainLayoutProps> = ({ children, username }) => {
  // hooks
  const { data, loading, error, refetch } = useUserQuery({
    variables: { username },
  });

  return (
    <UserContext.Provider
      value={{
        user: data?.user,
        data,
        loading,
        error,
        refetch,
      }}
    >
      <Navbar />

      <main className="sm:pt-20">{children}</main>
    </UserContext.Provider>
  );
};

export default UserLayout;
