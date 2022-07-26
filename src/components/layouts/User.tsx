import Navbar from '@components/modules/Navbar';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useTransition } from 'react';
import { useUserQuery } from '@graphql';
import UserContext from '@src/contexts/UserContext';
import { NextSeo } from 'next-seo';
import { useTranslation } from 'react-i18next';

interface MainLayoutProps {
  children: React.ReactNode;
  username: string;
}

const UserLayout: React.FC<MainLayoutProps> = ({ children, username }) => {
  // hooks
  const { t } = useTranslation();
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
      <NextSeo
        title={
          loading
            ? t('loading')
            : `${data?.user?.firstName} ${data?.user?.lastName}`
        }
      />

      <Navbar />

      <main className="sm:pt-20">{children}</main>
    </UserContext.Provider>
  );
};

export default UserLayout;
