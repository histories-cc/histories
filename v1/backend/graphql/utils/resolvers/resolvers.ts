import { GraphQLUpload } from 'graphql-upload';

import Mutation from './mutations';
import Query from './queries';

export type contextType = {
  decoded: { id: number };
  validToken: boolean;
};

export function OnlyLogged(context: contextType) {
  // if user is not logged throw error
  if (!context.validToken) throw new Error('User is not logged');
}

export function Validate(validationFunction: { error: string | null }) {
  const validationOutput = validationFunction.error;
  if (validationOutput) throw new Error(validationOutput);
}

const resolvers = {
  Upload: GraphQLUpload,

  Query,
  Mutation,
};

export default resolvers;
