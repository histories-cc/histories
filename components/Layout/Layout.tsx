import React from 'react';
import { Navbar } from '@components/Navbar';
import Head from 'next/head';
import ProtectedRoutes from './ProtectedRoutes';

type LayoutProps = {
  title: string;
  dontRedirectUnverified?: boolean;
  redirectLogged?: boolean;
  redirectNotLogged?: boolean;
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({
  title,
  dontRedirectUnverified,
  redirectLogged,
  redirectNotLogged,
  children,
}) => {
  return (
    <div>
      {(dontRedirectUnverified !== true ||
        redirectLogged ||
        redirectNotLogged) && (
        <ProtectedRoutes
          dontRedirectUnverified={dontRedirectUnverified}
          redirectLogged={redirectLogged}
          redirectNotLogged={redirectNotLogged}
        />
      )}
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="keywords"
          content="DELTA - Střední škola informatiky a ekonomie, s.r.o."
        />
        <link rel="icon" href="/icons/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link
          href="/icons/icon-72x72.png"
          rel="icon"
          type="image/png"
          sizes="72x72"
        />
        <link
          href="/icons/icon-512x512.png"
          rel="icon"
          type="image/png"
          sizes="512x512"
        />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.jpg"></link>
        <meta name="theme-color" content="#17A6FA" />
      </Head>
      <div className="sticky top-0 z-10 z-50">
        <Navbar />
      </div>
      {children}
    </div>
  );
};

export default Layout;
