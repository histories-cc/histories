import '../translation/i18n';
import 'src/styles/main.css';

import { ApolloProvider } from '@apollo/client';
import client from '../services/apollo';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import NextNprogress from 'nextjs-progressbar';
import React, { useEffect } from 'react';
import { orange_main } from '@src/constants/constants';
import UnderMaintenancePage from '@components/layouts/UnderMaintenancePage';

function MyApp({ Component, pageProps, router }: AppProps): JSX.Element {
  if (process.env.NEXT_PUBLIC_UNDER_MAINTENANCE)
    return <UnderMaintenancePage />;

  return (
    <ApolloProvider client={client}>
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
      <ThemeProvider attribute="class" defaultTheme="light">
        <Component {...pageProps} />
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default MyApp;
