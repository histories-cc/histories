import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { UserDocument, UserQuery } from '@graphql';
import UrlPrefix from '@src/constants/IPFSUrlPrefix';
import { SSRRedirect } from '@src/functions';
import { GetServerSidePropsContext } from 'next';
import React from 'react';

import { ValidateUsername } from '../../../../shared/validation';

const ProfilePicturePage: React.FC<{
  profile: string;
}> = ({ profile }) => {
  return (
    <div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={profile.startsWith('http') ? profile : UrlPrefix + profile}
        alt="profile"
      />
    </div>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;

  // create new apollo graphql client
  const client = new ApolloClient({
    link: createHttpLink({
      uri:
        process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ??
        'http://localhost:3000/api/graphql',
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

      // return props
      return {
        props: {
          profile: userQuery.user.profile,
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

export default ProfilePicturePage;
