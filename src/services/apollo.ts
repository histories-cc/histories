import { ApolloClient, InMemoryCache } from "@apollo/client";
import Cookie from 'js-cookie';

const client = new ApolloClient({
  uri: process.env.BACKEND || "http://localhost:4000",
  cache: new InMemoryCache(),
  headers: {
    session: `${Cookie.get('session')}}`
  }
});

export default client;
