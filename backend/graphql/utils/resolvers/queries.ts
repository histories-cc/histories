import {
  CommentsInput,
  PersonalizedPostsInput,
  PlacesInput,
  PostsInput,
  SearchInput,
} from '../../../../src/graphql/index';
import {
  CollectionQuery,
  FilterPlacesQuery,
  MeQuery,
  PersonalizedPostsQuery,
  PlaceQuery,
  PostQuery,
  PostsQuery,
  SuggestedUsersQuery,
  UserQuery,
} from '../../../graphql/resolvers';
import CommentsQuery from '../../resolvers/comment/CommentsQuery';
import FullTextSearch from '../../resolvers/search/FullTextSearch';
import { contextType } from './resolvers';

const queries = {
  // TESTING HELLO QUERY
  hello: () => {
    return 'Hello';
  },

  // SEARCH
  search: async (_parent: undefined, { input }: { input: SearchInput }) =>
    await FullTextSearch(input.text),

  // PLACE
  place: async (_parent: undefined, { id }: { id: number }) =>
    await PlaceQuery({ id }),

  // PLACES
  places: async (
    _parent: undefined,
    {
      input,
    }: {
      input: PlacesInput;
    },
    context: contextType
  ) =>
    await FilterPlacesQuery({
      ...input,
      loggedId: context.validToken ? context.decoded.id : null,
    }),

  // POST
  post: async (
    _parent: undefined,
    { id }: { id: number },
    context: contextType
  ) =>
    await PostQuery({
      id,
      logged: context.decoded === null ? null : context.decoded.id,
    }),

  // POSTS
  posts: async (
    _parent: undefined,
    {
      input,
    }: {
      input: PostsInput;
    },
    context: contextType
  ) =>
    await PostsQuery({
      ...input,
      loggedId: context.validToken ? context.decoded.id : null,
    }),

  // PERSONALIZED POSTS
  personalizedPosts: async (
    _parent: undefined,
    { input }: { input: PersonalizedPostsInput },
    context: contextType
  ) =>
    await PersonalizedPostsQuery({
      ...input,
      logged: context.validToken ? context.decoded.id : null,
    }),

  suggestedUsers: async (
    _parent: undefined,
    _input: undefined,
    context: contextType
  ) => {
    return await SuggestedUsersQuery(
      context.validToken ? context.decoded.id : null
    );
  },

  // LOGGED USER
  me: async (_parent: undefined, _input: undefined, context: contextType) =>
    // if user is logged return user data, else return null
    context.validToken ? await MeQuery({ id: context.decoded.id }) : null,

  // USER QUERY
  user: async (
    _parent: undefined,
    { input }: { input: { username: string; id: number } },
    context: contextType
  ) =>
    await UserQuery({
      logged: context.validToken ? context.decoded.id : undefined,
      ...input,
    }),

  // COMMENTS
  comments: async (_parent: undefined, { input }: { input: CommentsInput }) =>
    await CommentsQuery(input),

  // COLLECTION QUERY
  collection: async (
    _parent: undefined,
    { id }: { id: number },
    context: contextType
  ) =>
    await CollectionQuery({
      id,
      logged: context.validToken ? context.decoded.id : null,
    }),
};

export default queries;
