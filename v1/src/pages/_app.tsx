import '../translation/i18n';
import 'src/styles/main.css';

import { ApolloProvider } from '@apollo/client';
import { useMeQuery } from '@graphql';
import MeContext from '@src/contexts/MeContext';
import { useApollo } from '@src/utils/apollo';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import NextNprogress from 'nextjs-progressbar';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { orange_main } from '../../shared/constants/colors';

function MyApp({ Component, pageProps, router }: AppProps): JSX.Element {
  const apolloClient = useApollo(null);

  // todo: use language from database

  return (
    <ApolloProvider client={apolloClient}>
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`}
      />
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
      <MeProvider>
        <ThemeProvider attribute="class" defaultTheme="light">
          <Component {...pageProps} />
        </ThemeProvider>
      </MeProvider>
    </ApolloProvider>
  );
}

interface MeProviderProps {
  children: React.ReactNode;
}

// this needs to be component, because query can only be used inside AppoloProvider
const MeProvider: React.FC<MeProviderProps> = ({ children }) => {
  // fetch me data
  const { data, loading, error, refetch } = useMeQuery();

  const { i18n } = useTranslation();
  useEffect(() => {
    // on load get browser language
    i18n.changeLanguage(data?.me?.locale || navigator.language);
  }, [data]);

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
