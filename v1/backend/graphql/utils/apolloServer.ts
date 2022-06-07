import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import { verify } from 'jsonwebtoken';

import { allowedErrors } from '../../constants/errors';
import schema from './schema';

const apolloServer = new ApolloServer({
  schema,
  introspection: true,
  plugins: [
    // graphql playground
    ApolloServerPluginLandingPageGraphQLPlayground({
      endpoint: '/api/graphql',
    }),
  ],
  context: (context) => {
    try {
      // get JWT
      const jwt = context.req.headers.authorization!.substring(7);
      // verify JWT
      const decoded = verify(jwt, process.env.JWT_SECRET!);
      return { validToken: true, decoded: decoded };
      // if JWT is nto valid
    } catch (err) {
      return { validToken: false, decoded: null };
    }
  },
  formatError: (error) => {
    console.log(error);

    return allowedErrors.includes(error.message)
      ? new Error(error.message)
      : new Error('Unknown error');
  },
});

export const ApplyMidleware = async (server: any) => {
  await apolloServer.start();

  await apolloServer.applyMiddleware({
    app: server,
    path: '/api/graphql',
  });
};
