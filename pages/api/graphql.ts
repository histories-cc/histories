import { ApolloServer } from 'apollo-server-micro';
import { makeExecutableSchema } from '@graphql-tools/schema';

import { verify } from 'jsonwebtoken';
import PostQuery from '@lib/queries/PostQuery';
import {
  IsUsedUsername,
  ExistsUser,
  ValidateEmail,
  ValidateUsername,
  ValidateName,
  ValidatePassword,
  FollowsUser,
  ValidateCoordinates,
  ValidateDescription,
  ValidateDate,
} from '@lib/validation';
import IsUsedEmail from '@lib/validation/dbValidation/IsUsedEmail';
import PersonalizedPostsQuery from '@lib/queries/PersonalizedPostsQuery';
import VerifyToken from '@lib/mutations/VerifyToken';
import IsVerified from '@lib/queries/IsVerified';
import PlaceQuery from '@lib/queries/PlaceQuery';
import typeDefs from '@graphql/type-defs';
import {
  GetPaths,
  GetTagInfo,
  Login,
  SuggestedUsersQuery,
  UserQuery,
} from '@lib/queries';
import {
  CreateCollection,
  CreatePost,
  CreateUser,
  DeletePost,
  DeleteUser,
  EditProfile,
  Follow,
  Like,
  Unfollow,
} from '@lib/mutations';
import FilterPlaces from '@lib/queries/FilterPlaces';

type contextType = {
  decoded: { id: number };
  validToken: boolean;
};

const resolvers = {
  Query: {
    hello: () => {
      return 'Hello';
    },
    place: async (_parent: undefined, { id }: { id: number }) => {
      return await PlaceQuery({ id });
    },

    personalizedPosts: async (
      _parent: undefined,
      _input: undefined,
      context: any
    ) => {
      return await PersonalizedPostsQuery(
        context.validToken ? context.decoded.id : null
      );
    },

    paths: async () => {
      return await GetPaths();
    },

    suggestedUsers: async (
      _parent: undefined,
      _input: undefined,
      context: any
    ) => {
      return await SuggestedUsersQuery(
        context.validToken ? context.decoded.id : null
      );
    },

    mapPosts: async (
      _parent: undefined,
      {
        input,
      }: {
        input: {
          maxLatitude: number;
          minLatitude: number;
          maxLongitude: number;
          minLongitude: number;
        };
      }
    ) => {
      return await FilterPlaces(input);
    },

    checkIfLogged: async (
      _parent: undefined,
      _input: undefined,
      context: any
    ) => {
      // return user data
      if (context.validToken) {
        return {
          logged: true,
          verified: await IsVerified(context.decoded.id),
        };
      } else return { logged: false, verified: undefined };
    },

    isLogged: async (
      _parent: undefined,
      _input: undefined,
      context: contextType
    ) => {
      // return user data
      if (context.validToken)
        return await UserQuery({ id: context.decoded.id });
      else return null;
    },

    post: async (_parent: undefined, { id }: { id: number }, context: any) => {
      return await PostQuery({
        id,
        logged: context.decoded === null ? null : context.decoded.id,
      });
    },

    tag: async (
      _parent: undefined,
      { label }: { label: string },
      context: any
    ) => {
      return GetTagInfo({ label });
    },

    user: async (
      _parent: undefined,
      { input }: { input: { username: string; id: number } },
      context: contextType
    ) => {
      return await UserQuery({
        logged: context.validToken ? context.decoded.id : undefined,
        ...input,
      });
    },
  },
  Mutation: {
    like: async (
      _parent: undefined,
      { input }: { input: { id: number; type: string; to: string } },
      context: any
    ) => {
      return Like({ ...input, logged: context.decoded.username });
    },

    updateProfile: async (
      _parent: undefined,
      {
        input,
      }: {
        input: {
          username: string | undefined;
          bio: string | undefined;
          firstName: string | undefined;
          lastName: string | undefined;
          email: string | undefined;
          password: string | undefined;
        };
      },
      context: any
    ) => {
      const user = await UserQuery({
        logged: context.validToken ? context.decoded.username : undefined,
        id: context.decoded.id,
      });
      if (input.username !== undefined) {
        const validateUsername = ValidateUsername(input.username).error;
        if (validateUsername) throw new Error(validateUsername);
        if (user.username != input.username)
          if (await IsUsedUsername(input.username))
            throw new Error('Username is already used');
      }
      if (input.email !== undefined) {
        const validateEmail = ValidateEmail(input.email).error;
        if (validateEmail) throw new Error(validateEmail);
        if (user.email != input.email)
          if (await IsUsedEmail(input.email))
            throw new Error('Email is already used');
      }
      // check first name
      if (input.firstName !== undefined) {
        const validateFirstName = ValidateName(input.firstName).error;
        if (validateFirstName)
          throw new Error('First name ' + validateFirstName);
      }
      if (input.lastName !== undefined) {
        // check last name
        const validateLastName = ValidateName(input.lastName).error;
        if (validateLastName) throw new Error('Last name ' + validateLastName);
      }

      if (input.bio !== undefined) {
        const validateBio = ValidateDescription(input.bio).error;
        if (validateBio) throw new Error(validateBio);
      }

      EditProfile({ ...input, id: context.decoded.id });
      return 'idk';
    },

    searchUser: async () => {
      // search for username like this
    },

    login: async (
      _parent: undefined,
      { input }: { input: { username: string; password: string } }
    ) => {
      // check username
      if (
        ValidateUsername(input.username).error &&
        ValidateEmail(input.username).error
      )
        throw new Error('Wrong credentials');

      // check password
      if (ValidatePassword(input.password).error)
        throw new Error('Wrong credentials');

      // if credentials are wrong returns null
      const login = await Login(input);
      if (login !== null) return login;
      else throw new Error('Wrong credentials');
    },

    createUser: async (
      _parent: undefined,
      {
        input,
      }: {
        input: {
          username: string;
          firstName: string;
          lastName: string;
          email: string;
          password: string;
        };
      }
    ) => {
      // check email
      const validateEmail = ValidateEmail(input.email).error;
      if (validateEmail) throw new Error(validateEmail);

      if (await IsUsedEmail(input.email))
        throw new Error('Email is already used');

      // check username
      const validateUsername = ValidateUsername(input.username).error;
      if (validateUsername) throw new Error(validateUsername);

      if (await IsUsedUsername(input.username))
        throw new Error('Username is already used');

      // check first name
      const validateFirstName = ValidateName(input.firstName).error;
      if (validateFirstName) throw new Error('First name ' + validateFirstName);

      // check last name
      const validateLastName = ValidateName(input.lastName).error;
      if (validateLastName) throw new Error('Last name ' + validateLastName);

      // check password
      const validatePassword = ValidatePassword(input.password).error;
      if (validatePassword) throw new Error(validatePassword);

      return await CreateUser(input);
    },

    createCollection: async (
      _parent: undefined,
      {
        input,
      }: {
        input: {
          username: string;
          collectionName: string;
          description: string;
        };
      }
    ) => {
      return CreateCollection(input);
    },

    createPost: async (
      _parent: undefined,
      {
        input,
      }: {
        input: {
          description: string;
          hashtags: string;
          photoDate: string;
          longitude: number;
          latitude: number;
        };
      },
      context: any
    ) => {
      // check coordinates
      const validateCoordinates = ValidateCoordinates([
        input.latitude,
        input.longitude,
      ]).error;
      if (validateCoordinates) throw new Error(validateCoordinates);

      // check description
      const validateDescription = ValidateDescription(input.description).error;
      if (validateDescription) throw new Error(validateDescription);

      // check date
      const validateDate = ValidateDate(Number(input.photoDate)).error;
      if (validateDate) throw new Error(validateDate);

      if (context.validToken)
        return CreatePost({ ...input, userID: context.decoded.id });
      else throw new Error('User is not logged');
    },

    deletePost: async (
      _parent: undefined,
      { id }: { id: number },
      context: any
    ) => {
      return context.validToken
        ? DeletePost({ logged: context.decoded.username, id })
        : null;
    },

    deleteUser: async (
      _parent: undefined,
      { input }: { input: { username: string; password: string } }
    ) => {
      return DeleteUser(input);
    },

    verifyToken: async (_parent: undefined, { token }: { token: string }) => {
      return await VerifyToken(token);
    },

    follow: async (
      _parent: undefined,
      { userID }: { userID: number },
      context: any
    ) => {
      // if user wants to follow himself
      if (context.decoded.id == userID)
        throw new Error('You cannot follow yourself');

      // if logged user does not exist
      if (!(await ExistsUser(context.decoded.id)))
        throw new Error('Logged user is not valid');

      // if user to follow does not exist
      if (!(await ExistsUser(userID))) throw new Error('User does not exist');

      // check if there already is relation
      if (await FollowsUser(context.decoded.id, userID))
        throw new Error('User is already followed');

      return await Follow(context.decoded.id, userID);
    },

    unfollow: async (
      _parent: undefined,
      { userID }: { userID: number },
      context: any
    ) => {
      return Unfollow(context.decoded.username, userID);
    },
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const apolloServer = new ApolloServer({
  schema,
  context: (context) => {
    try {
      // get JWT
      const jwt = context.req.headers.authorization.substring(7);
      // verify JWT
      const decoded = verify(jwt, process.env.JWT_SECRET!);
      return { validToken: true, decoded: decoded };
      // if JWT is nto valid
    } catch (err) {
      return { validToken: false, decoded: null };
    }
  },
});

const handler = apolloServer.createHandler({ path: '/api/graphql' });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
