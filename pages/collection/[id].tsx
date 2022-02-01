import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import UserLayout from '@components/Layouts/User';
import Card from '@components/Modules/UserPage/Card';
import {
  CollectionDocument,
  CollectionQuery,
} from '@graphql/collection.graphql';
import { usePostsQuery } from '@graphql/post.graphql';
import { UserDocument, UserQuery } from '@graphql/user.graphql';
import {
  GetCookieFromServerSideProps,
  IsJwtValid,
  SSRRedirect,
} from '@lib/functions';
import { GetServerSidePropsContext } from 'next';
import Image from 'next/image';
import React, { useState } from 'react';
import { Blurhash } from 'react-blurhash';
import { useTranslation } from 'react-i18next';

import { Maybe } from '../../.cache/__types__';
import UrlPrefix from '../../shared/config/UrlPrefix';

const CheckPost: React.FC<{
  collection: {
    name: string;
    description?: Maybe<string>;
    createdAt: number;
    postCount: number;
    id: number;
    author: {
      firstName: string;
      lastName: string;
      bio: string;
      profile: string;
    };
  };
  user: any;
}> = ({ collection, user }) => {
  const { data, loading, error } = usePostsQuery({
    variables: { input: { filter: { collectionId: collection.id } } },
  });
  const { t } = useTranslation<string>();

  return (
    <UserLayout
      user={user}
      currentTab="collections"
      head={{
        title: `${collection.name} | Histories`,
        description:
          collection.description ??
          `${collection.author.firstName}'s collection`,
        canonical: `https://www.histories.cc/collection/${collection.id}`,
        openGraph: {
          title: `Collection | Histories`,
          type: 'website',
          url: `https://www.histories.cc/collection/${collection.id}`,
          description:
            collection.description ??
            `${collection.author.firstName}'s collection`,
          site_name: 'Collection',
        },
      }}
    >
      <h1 className="pt-4 text-3xl font-semibold">{collection.name}</h1>
      <p className="pb-4">{collection.description}</p>
      {loading ? (
        'loading posts'
      ) : error ? (
        'something went wront, try refreshing page'
      ) : data?.posts.length == 0 ? (
        <Card>
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
              className="w-8 h-8 text-brand-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              ></path>
            </svg>
            <div>{t('no_posts')}</div>
          </>
        </Card>
      ) : (
        <section className="mt-4 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 ">
          {data?.posts.map((post, index) => (
            <PostMiniature key={index} post={post} />
          ))}
        </section>
      )}
    </UserLayout>
  );
};

const PostMiniature: React.FC<{ post: any }> = ({ post }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  return (
    <div className="relative w-full h-48 bg-white border rounded-lg dark:border-[#373638] dark:bg-[#2b2b2b] shadow-sm dark:shadow-md">
      {isLoading && (
        <div className="flex items-center justify-center w-full h-full">
          <Blurhash
            hash={post.photos[0].blurhash}
            width={'100%'}
            height={'100%'}
            punch={1}
          />
        </div>
      )}
      <Image
        src={UrlPrefix + post.photos[0].hash}
        layout="fill"
        objectFit="contain"
        placeholder="blur"
        blurDataURL={'https://ipfs.io/ipfs' + post.photos[0].hash}
        onLoadingComplete={() => setIsLoading(false)}
        objectPosition="center"
        alt="Profile picture"
      />
    </div>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { query, req } = ctx;
  if (typeof query.id !== 'string') return { props: { id: null } };
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
    try {
      const { data: collectionData }: { data: CollectionQuery } =
        await client.query({
          query: CollectionDocument,
          variables: { id: parseInt(query.id) },
        });

      const { data: userData }: { data: UserQuery } = await client.query({
        query: UserDocument,
        variables: { input: { id: collectionData.collection.author.id } },
      });

      // return props
      return {
        props: {
          collection: collectionData.collection,
          user: userData.user,
          anonymous,
        },
      };
    } catch (e) {
      return SSRRedirect('/404?error=collection_does_not_exist');
    }
  }
  // this should not be needed 🤷‍♀️
  return {
    props: {},
  };
};

export default CheckPost;
