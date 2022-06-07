import MeContext from '@src/contexts/MeContext';
import HeadProps from '@src/types/head';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import React, { useContext, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

import { orange_main } from '../../../shared/constants/colors';
import { Navbar } from '../modules/navbar';

interface MainLayoutProps {
  head: HeadProps;

  redirectLogged?: boolean;
  redirectNotLogged?: boolean;
  children: React.ReactNode;
  background?: string;
}

const Layout: React.FC<MainLayoutProps> = ({
  head,
  redirectLogged,
  redirectNotLogged,
  children,
  background,
}) => {
  const meContext = useContext(MeContext);

  const router = useRouter();

  useEffect(() => {
    if (
      (redirectLogged && meContext.data?.me?.id) ||
      (redirectNotLogged &&
        (meContext.data?.me?.id === undefined ||
          meContext.data?.me?.id === null))
    )
      router.push('/');
  }, [meContext.data]);

  return (
    <>
      <NextSeo
        title={head.title}
        description={head.description}
        canonical={head.canonical}
        openGraph={{
          ...head.openGraph,
          locale: 'en_US',
        }}
        twitter={{
          handle: '@handle',
          site: '@site',
          cardType: 'summary_large_image',
        }}
        additionalMetaTags={[
          {
            name: 'theme-color',
            content: orange_main,
          },
          {
            name: 'keywords',
            content:
              'historical photos, old places, timeline, map, places history, Pardubice v běhu času, Pardubice history, history of place, social site, history places on map, map with timeline',
          },
          {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1.0',
          },
          {
            name: 'msapplication-TileColor',
            content: orange_main,
          },
          {
            name: 'msapplication-config',
            content: '/icons/browserconfig.xml',
          },
        ]}
        additionalLinkTags={[
          {
            rel: 'apple-touch-icon',
            sizes: '180x180',
            href: '/icons/apple-touch-icon.png',
          },
          {
            rel: 'icon',
            type: 'image/png',
            sizes: '32x32',
            href: '/icons/favicon-32x32.png',
          },
          {
            rel: 'icon',
            type: 'image/png',
            sizes: '16x16',
            href: '/icons/favicon-16x16.png',
          },
          {
            rel: 'manifest',
            href: '/manifest.json',
          },
          {
            rel: 'mask-icon',
            href: '/icons/safari-pinned-tab.svg',
            color: orange_main,
          },
          {
            rel: 'shortcut icon',
            href: '/icons/favicon.ico',
          },
        ]}
      />
      <Toaster position="top-center" reverseOrder={true} />
      <Navbar />
      <div
        className={
          'min-h-screen pt-14 ' + background || 'bg-[#FAFBFB] dark:bg-[#171716]'
        }
      >
        {children}
      </div>
    </>
  );
};

export default Layout;
