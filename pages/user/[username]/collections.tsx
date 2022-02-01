import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { CollectionsIcon, PlusIcon } from '@components/icons';
import UserLayout from '@components/Layouts/User';
import Card from '@components/Modules/UserPage/Card';
import { UserDocument, UserQuery } from '@graphql/user.graphql';
import {
  GetCookieFromServerSideProps,
  IsJwtValid,
  SSRRedirect,
} from '@lib/functions';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { ValidateUsername } from '../../../shared/validation';

const CollectionsPage: React.FC<{
  userQuery: UserQuery;
  anonymous: boolean;
}> = ({ userQuery }) => {
  const user = userQuery.user;
  const { t } = useTranslation();
  return (
    <UserLayout
      user={user}
      currentTab="collections"
      head={{
        title: '',
        description: '',
        canonical: undefined,
        // @ts-ignore
        openGraph: undefined,
      }}
    >
      <div className="flex justify-end w-full">
        <Link href="/create/post" passHref>
          <button className="flex items-center px-3 py-1 text-xs font-semibold text-gray-500 border border-gray-500 rounded-full gap-2 space-x-1.5 shadown-sm w-max">
            <PlusIcon className="w-2 h-2" /> {t('create_collection')}
          </button>
        </Link>
      </div>
      {userQuery.user.collections?.length == 0 ? (
        <Card>
          <CollectionsIcon className="w-8 h-8" />
          <div>{t('no_collections')}</div>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
          {userQuery.user.collections?.map((collection, index) => (
            <Link key={index} href={`/collection/${collection?.id}`} passHref>
              <div className="flex items-center justify-center w-full h-64 border rounded-lg cursor-pointer dark:border-[#373638] dark:bg-[#2b2b2b] shadow-sm dark:shadow-md">
                {collection?.name}
              </div>
            </Link>
          ))}
        </div>
      )}
    </UserLayout>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  const jwt = GetCookieFromServerSideProps(req.headers.cookie, 'jwt');
  const anonymous = jwt === null ? true : IsJwtValid(jwt);

  // create new apollo graphql client
  const client = new ApolloClient({
    link: createHttpLink({
      uri:
        process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ??
        'http://localhost:3000/api/graphql',
      headers: {
        authorization: jwt ? `Bearer ${jwt}` : '',
      },
    }),

    cache: new InMemoryCache(),
  });

  // fetch user query
  if (!req.url?.startsWith('_next')) {
    // check if username is valid, if not redirect to 404 page with argument
    if (typeof ctx.query.username !== 'string')
      return SSRRedirect('/404?error=user_does_not_exist');

    const validateUsername = ValidateUsername(ctx.query.username).error;
    if (validateUsername) return SSRRedirect('/404?error=user_does_not_exist');

    try {
      const { data: userQuery }: { data: UserQuery } = await client.query({
        query: UserDocument,
        variables: { input: { username: ctx.query.username } },
      });

      // return props
      return {
        props: {
          userQuery,
          anonymous,
        },
      };
    } catch (e) {
      return SSRRedirect('/404?error=user_does_not_exist');
    }
  }
  return {
    // @ts-ignore
    // this should not be needed 🤷‍♀️
    props: { user: { username: ctx.query.username }, anonymous },
  };
};

export default CollectionsPage;
