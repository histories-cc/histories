import '../translation/i18n';
import '../styles/main.css';

import { ApolloProvider } from '@apollo/client';
import client from '../services/apollo';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import NextNprogress from 'nextjs-progressbar';
import React, { useEffect } from 'react';
import { orange_main } from '@src/constants/constants';
import UnderMaintenancePage from '@components/templates/UnderMaintenance';
import { useMeQuery } from '@graphql';
import MeContext from '@src/contexts/MeContext';
import { Toaster } from 'react-hot-toast';
import { KBarProvider } from "kbar";
import { KBarActions } from '@src/constants';
import KBar from '@components/modules/kbar/KBar';

function MyApp({ Component, pageProps, router }: AppProps): JSX.Element {
  if (process.env.NEXT_PUBLIC_UNDER_MAINTENANCE && router.pathname !== "/storybook")
    return <UnderMaintenancePage />;

  return (
    <ApolloProvider client={client}>
      {
        // don't show progress bar on map page, because of often changing url query params
        !(router.pathname === '/') && (
          <NextNprogress
            color={orange_main}
            height={2}
            options={{ showSpinner: false }}
            showOnShallow
          />
        )
      }
      <ThemeProvider attribute="class" defaultTheme="light">
        <MeProvider>
          <Toaster position="top-center" reverseOrder={true} />
          <KBarProvider actions={KBarActions}>
            <KBar/>
            <Component {...pageProps} />
          </KBarProvider>
        </MeProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

interface IMeProviderProps {
  children: React.ReactNode;
}
const MeProvider: React.FC<IMeProviderProps> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data, loading, error, refetch } = useMeQuery();

  return (
    <MeContext.Provider
      value={{
        isLoggedIn: data?.me != undefined,
        me: data?.me,
        data,
        loading,
        error,
        refetch,
      }}
    >
      {children}
    </MeContext.Provider>
  );
};

export default MyApp;
