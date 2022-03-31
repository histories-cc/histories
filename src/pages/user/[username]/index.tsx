import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  QueryResult,
} from '@apollo/client';
import UserLayout from '@components/layouts/User';
import { Post } from '@components/modules/post';
import Card from '@components/modules/userPage/Card';
import {
  PostsDocument,
  PostsQuery,
  usePostsQuery,
} from '@graphql/queries/post.graphql';
import { UserDocument, UserQuery } from '@graphql/queries/user.graphql';
import UrlPrefix from '@src/constants/IPFSUrlPrefix';
import {
  GetCookieFromServerSideProps,
  IsJwtValid,
  SSRRedirect,
} from '@src/functions';
import { GetServerSidePropsContext } from 'next';
import React from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';

import { Exact, InputMaybe, PostsInput } from '../../../../.cache/__types__';
import { ValidateUsername } from '../../../../shared/validation';

const PostsPage: React.FC<{
  userQuery: UserQuery;
  posts: QueryResult<
    PostsQuery,
    Exact<{
      input?: InputMaybe<PostsInput> | undefined;
    }>
  >;
  anonymous: boolean;
}> = ({ userQuery, posts: postsTmp }) => {
  const user = userQuery.user as NonNullable<UserQuery['user']>;
  const { t } = useTranslation();

  const { data, loading, refetch, fetchMore, error } = usePostsQuery({
    variables: {
      input: {
        filter: {
          authorUsername: user.username,
          skip: 0,
          take: 20,
        },
      },
    },
  });

  if (error) return <div>{JSON.stringify(error)}</div>;

  return (
    <UserLayout
      user={user}
      currentTab="posts"
      heading={t('posts')}
      head={{
        title: `${user.firstName} ${user?.lastName || ''} | Histories`,
        description: `${user.firstName} ${user?.lastName}'s profile on HiStories`,
        canonical: `https://www.histories.cc/user/${user.username}`,
        openGraph: {
          title: `${user.firstName} ${user.lastName || ''}  | Histories`,
          type: 'website',
          images: [
            {
              url: user.profile.startsWith('http')
                ? user.profile
                : UrlPrefix + user.profile,
              width: 92,
              height: 92,
              alt: `${user.firstName}'s profile picture`,
            },
          ],
          url: `https://www.histories.cc/user/${user.username}`,
          description: `${user.firstName} ${user?.lastName}'s profile`,
          site_name: 'Profil page',
          profile: { ...user, lastName: user.lastName || undefined },
        },
      }}
    >
      {loading ? (
        <div></div>
      ) : (
        <div className="w-full">
          <InfiniteScroll
            dataLength={data!.posts.length} //This is important field to render the next data
            next={() => {
              fetchMore({
                variables: {
                  input: {
                    filter: {
                      authorUsername: user.username,
                      skip: data?.posts.length || 0,
                      take: 20,
                    },
                  },
                },
                updateQuery: (previousResult, { fetchMoreResult }) => {
                  return {
                    ...previousResult,
                    posts: [
                      ...previousResult.posts,
                      ...(fetchMoreResult?.posts ?? []),
                    ],
                  };
                },
              });
            }}
            hasMore={(data?.posts.length ?? 1) % 20 == 0}
            loader={
              <p style={{ textAlign: 'center' }}>
                <b>loading</b>
              </p>
            }
            refreshFunction={async () => await refetch()}
          >
            {loading
              ? postsTmp.data?.posts.map((post) => (
                  <Post {...post} key={post.id} photos={post.photos} />
                ))
              : data?.posts.map((post) => (
                  <Post {...post} key={post.id} photos={post.photos} />
                ))}
            {data?.posts.length == 0 && (
              <Card>
                <div>
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
                </div>
                <div>
                  {user.firstName} doesn{"'"}t have any posts yet
                </div>
              </Card>
            )}
          </InfiniteScroll>
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

      if (userQuery.user == undefined)
        return SSRRedirect('/404?error=user_does_not_exist');

      const postsQuery = await client.query({
        query: PostsDocument,
        variables: {
          input: {
            filter: {
              authorUsername: ctx.query.username,
              skip: 0,
              take: 10,
            },
          },
        },
      });

      // return props
      return {
        props: {
          userQuery,
          posts: postsQuery,
          anonymous,
        },
      };
    } catch (e) {
      return SSRRedirect('/404?error=user_does_not_exist');
    }
  }
  // this should not be needed 🤷‍♀️
  return {
    props: {},
  };
};

export default PostsPage;
