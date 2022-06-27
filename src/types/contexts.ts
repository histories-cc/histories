import { ApolloError, ApolloQueryResult } from '@apollo/client';
import { MeQuery } from '@graphql';

interface IMeContext {
  isLoggedIn: boolean;
  me: MeQuery['me'] | undefined;
  data: MeQuery | undefined;
  loading: boolean;
  error: ApolloError | undefined;
  refetch: (() => Promise<ApolloQueryResult<MeQuery>>) | undefined;
}

export default IMeContext;
