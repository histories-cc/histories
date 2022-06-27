import { ApolloError, ApolloQueryResult } from '@apollo/client';
import { MeQuery, UserQuery } from '@graphql';

export interface IMeContext {
  isLoggedIn: boolean;
  me: MeQuery['me'] | undefined;
  data: MeQuery | undefined;
  loading: boolean;
  error: ApolloError | undefined;
  refetch: (() => Promise<ApolloQueryResult<MeQuery>>) | undefined;
}

export interface IUserContext {
  user: UserQuery['user'] | undefined;
  data: UserQuery | undefined;
  loading: boolean;
  error: ApolloError | undefined;
  refetch: (() => Promise<ApolloQueryResult<UserQuery>>) | undefined;
}
