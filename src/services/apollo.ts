import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: process.env.BACKEND || "http://localhost:4000",
  cache: new InMemoryCache(),
});

export default client;
