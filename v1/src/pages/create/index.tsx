import { Layout } from '@components/layouts';
import {
  GetCookieFromServerSideProps,
  IsJwtValid,
  SSRRedirect,
} from '@src/functions';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { HiCollection, HiFolderOpen } from 'react-icons/hi';

const CreatePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Layout
      head={{
        title: `Create | Histories`,
        description: `Create new collection or post`,
        canonical: 'https://www.histories.cc/create/',
        openGraph: {
          title: `Create | Histories`,
          type: 'website',
          url: 'https://www.histories.cc/create/',
          description: `Create new collection or post`,
          site_name: 'Create page',
        },
      }}
    >
      <div className="flex flex-col w-full max-w-6xl px-6 m-auto mt-24 gap-4">
        <span>{t('create_page_description')}</span>
        <Link href="/create/post" passHref>
          <div className="flex items-center px-4 py-1 text-lg font-semibold text-gray-700 border border-gray-200 rounded-lg cursor-pointer gap-2 hover:bg-gray-200 w-fit">
            <HiFolderOpen className="w-4 h-4" />
            {t('create_post')}
          </div>
        </Link>
        <Link href="/create/collection" passHref>
          <div className="flex items-center px-4 py-1 text-lg font-semibold text-gray-700 border border-gray-200 rounded-lg cursor-pointer gap-2 hover:bg-gray-200 w-fit">
            <HiCollection className="w-4 h-4" />
            {t('create_collection')}
          </div>
        </Link>
      </div>
    </Layout>
  );
};
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req, query } = ctx;
  const cookies = req.headers.cookie; // get cookies

  const jwt = GetCookieFromServerSideProps(cookies, 'jwt');

  // if JWT is null redirect
  if (jwt === null) return SSRRedirect('/login');
  // if there is JWT, verify it
  else if (IsJwtValid(jwt)) {
    const placeID =
      typeof query.placeID === 'string' ? parseFloat(query.placeID) : null;
    const latitude =
      typeof query.latitude === 'string' ? parseFloat(query.latitude) : null;
    const longitude =
      typeof query.longitude === 'string' ? parseFloat(query.longitude) : null;
    return {
      props: {
        placeID,
        latitude,
        longitude,
      },
    };
  } else return SSRRedirect('/login');
};

export default CreatePage;
