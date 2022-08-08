import Navbar from '@components/molecules/Navbar';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useTransition } from 'react';
import { useUserQuery } from '@graphql';
import UserContext from '@src/contexts/UserContext';
import { NextSeo } from 'next-seo';
import { useTranslation } from 'react-i18next';
import { Profile } from '@components/molecules/profile';

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

  if (data?.user == undefined) return <div>loading</div>

  const { user } = data

  return (
    <UserContext.Provider
      value={{
        user,
        data,
        loading,
        error,
        refetch,
      }}
    >
      <NextSeo
        title={
          `${user.firstName} ${user.lastName ?? ""}`
        }
      />

      <Navbar />

      <main className="sm:pt-20 grid grid-cols-12 lg:gap-8 container mx-auto max-w-screen-xl flex-grow py-8 px-0 sm:px-5">
        <section className='lg:col-span-4 md:col-span-12 col-span-12 pt-14'>
        <Profile
          firstName={user.firstName}
          lastName={user.lastName || undefined}
          followers={0}
          following={0}
          posts={0}
          username={user.username}
          />
          </section>

        <section className='lg:col-span-8 md:col-span-12 col-span-12 mb-5 space-y-5'>
        {children}
        </section>

      </main>
    </UserContext.Provider>
  );
};

export default UserLayout;
