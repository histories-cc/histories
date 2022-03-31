import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { Layout } from '@components/layouts';
import PostDetailTemplate from '@components/templates/PostDetailTemplate';
import { PostDocument, PostQuery } from '@graphql';
import { GetCookieFromServerSideProps, SSRRedirect } from '@src/functions';
import { GetServerSidePropsContext } from 'next';
import React from 'react';

interface PostDetailPageProps {
  post: PostQuery['post'];
}

const CheckPost: React.FC<PostDetailPageProps> = ({ post }) => {
  return (
    <Layout
      head={{
        title: `Post | hiStories`,
        description: `Post Histories, place where you can share historical photos of places`,
        canonical: `https://www.histories.cc/post/${post.id}`,
        openGraph: {
          title: `Post | Histories`,
          type: 'website',
          url: `https://www.histories.cc/post/${post.id}`,
          description: `Post Histories`,
          site_name: 'Post page',
        },
      }}
    >
      <PostDetailTemplate post={post} />
    </Layout>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;

  const jwt = GetCookieFromServerSideProps(req.headers.cookie, 'jwt');

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
    // check if post is valid, if not redirect to 404 page with argument
    if (typeof ctx.query.id !== 'string')
      return SSRRedirect('/404?error=post_does_not_exist');

    try {
      const { data: postQuery }: { data: PostQuery } = await client.query({
        query: PostDocument,
        variables: { id: parseFloat(ctx.query.id) },
      });

      // return props
      return {
        props: {
          post: postQuery.post,
        },
      };
    } catch (e) {
      return SSRRedirect('/404?error=post_does_not_exist');
    }
  }
  // this should not be needed 🤷‍♀️
  return {
    props: {},
  };
};

export default CheckPost;
