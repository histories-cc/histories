import { ApolloClient, InMemoryCache } from '@apollo/client';
import Cookie from 'js-cookie';

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_BACKEND || 'http://localhost:4000',
  cache: new InMemoryCache(),
  headers:
    typeof Cookie.get('session') === 'string'
      ? {
          session: `${Cookie.get('session')}`,
        }
      : {},
});

export default client;
