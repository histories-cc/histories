import ForgotPassword from '../../resolvers/User/Mutation/ForgotPassword';
import sharp from 'sharp';
import streamToPromise from 'stream-to-promise';

import {
  CreateUserInput,
  LoginInput,
  UpdateProfileInput,
  ResetPasswordInput,
  CreatePostInput,
} from '../../../../.cache/__types__';
import {
  ValidateComment,
  ValidateCoordinates,
  ValidateDate,
  ValidateDescription,
  ValidateEmail,
  ValidateName,
  ValidatePassword,
  ValidateUsername,
} from '../../../../shared/validation';
import { UploadPhoto } from '../../../IPFS';
import {
  AddPostToCollection,
  CreateCollection,
  CreateComment,
  CreatePost,
  CreateUser,
  Delete,
  DeleteUser,
  EditCollection,
  EditUser,
  Follow,
  GoogleAuth,
  Like,
  Login,
  RemovePostFromCollection,
  Report,
  Unfollow,
  Unlike,
  UserQuery,
  VerifyToken,
} from '../../resolvers';
import LastPost from '../../resolvers/lastPost';
import { contextType, OnlyLogged, Validate } from './resolvers';
import ResetPassword from '../../resolvers/User/Mutation/ResetPassword';

const mutations = {
  googleAuth: async (
    _parent: undefined,
    { googleJWT }: { googleJWT: string }
  ) => await GoogleAuth(googleJWT),

  forgotPassword: async (_parent: undefined, { login }: { login: string }) =>
    await ForgotPassword(login),

  resetPassword: async (
    _parent: undefined,
    { input }: { input: ResetPasswordInput }
  ) => ResetPassword(input.token, input.newPassword),

  login: async (_parent: undefined, { input }: { input: LoginInput }) =>
    await Login(input),

  like: async (
    _parent: undefined,
    { input }: { input: { type: string; id: number } },
    context: contextType
  ) => {
    OnlyLogged(context);
    return await Like({
      logged: context.decoded.id,
      target: input.id,
      type: input.type,
    });
  },
  unlike: async (
    _parent: undefined,
    { id }: { id: number },
    context: contextType
  ) => {
    OnlyLogged(context);
    return await Unlike({
      loggedID: context.decoded.id,
      id,
    });
  },

  addToCollection: async (
    _parent: undefined,
    { input }: { input: { collectionId: number; postId: number } },
    context: contextType
  ) => {
    OnlyLogged(context);
    await AddPostToCollection({
      ...input,
      userId: context.decoded.id,
    });
    return 0;
  },

  removeFromCollection: async (
    _parent: undefined,
    { input }: { input: { collectionId: number; postId: number } },
    context: contextType
  ) => {
    OnlyLogged(context);
    await RemovePostFromCollection({
      ...input,
      userId: context.decoded.id,
    });
    return 0;
  },

  report: async (
    _parent: undefined,
    { id }: { id: number },
    context: contextType
  ) => {
    OnlyLogged(context);
    await Report({ logged: context.decoded.id, target: id });
    return 0;
  },

  updateProfile: async (
    _parent: undefined,
    {
      input,
    }: {
      input: UpdateProfileInput;
    },
    context: contextType
  ) => {
    OnlyLogged(context);

    const user = await UserQuery({
      id: context.decoded.id,
    });

    if (input.username) Validate(ValidateUsername(input.username));

    if (input.email) Validate(ValidateEmail(input.email));

    // check first name
    if (input.firstName) {
      const validateFirstName = ValidateName(input.firstName).error;
      if (validateFirstName) throw new Error('First name ' + validateFirstName);
    }

    // check last name
    if (input.lastName) {
      const validateLastName = ValidateName(input.lastName).error;
      if (validateLastName) throw new Error('Last name ' + validateLastName);
    }

    if (input.bio) Validate(ValidateDescription(input.bio));

    return EditUser(input, context.decoded.id);
  },

  createComment: async (
    _parent: undefined,
    {
      input: { target, content },
    }: { input: { target: number; content: string } },
    context: contextType
  ) => {
    OnlyLogged(context);

    const validateComment = ValidateComment(content).error;

    if (validateComment) {
      throw new Error(validateComment);
    }

    await CreateComment({
      targetID: target,
      authorID: context.decoded.id,
      content,
    });
    return 0;
  },

  createUser: async (
    _parent: undefined,
    {
      input,
    }: {
      input: CreateUserInput;
    }
  ) => {
    // check email
    const validateEmail = ValidateEmail(input.email).error;
    if (validateEmail) throw new Error(validateEmail);

    // check username
    const validateUsername = ValidateUsername(input.username).error;
    if (validateUsername) throw new Error(validateUsername);

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
        name: string;
        description: string;
        isPrivate: boolean;
      };
    },
    context: contextType
  ) => {
    OnlyLogged(context);
    return CreateCollection({
      ...input,
      preview: '',
      userId: context.decoded.id,
    });
  },

  editCollection: async (
    _parent: undefined,
    {
      input,
    }: {
      input: {
        name: string;
        description: string;
        isPrivate: boolean;
        collectionId: number;
      };
    },
    context: contextType
  ) => {
    OnlyLogged(context);
    return EditCollection({
      ...input,
      preview: '',
      userId: context.decoded.id,
    });
  },

  createPost: async (
    _parent: undefined,
    {
      input,
    }: {
      input: CreatePostInput;
    },
    context: contextType
  ) => {
    OnlyLogged(context);
    // check coordinates
    const validateCoordinates = ValidateCoordinates([
      input.latitude,
      input.longitude,
    ]).error;
    if (validateCoordinates) throw new Error(validateCoordinates);

    // check description
    if (input.description) {
      const validateDescription = ValidateDescription(input.description).error;
      if (validateDescription) throw new Error(validateDescription);
    }

    // check date
    const validateDate = ValidateDate(Number(input.photoDate)).error;
    if (validateDate) throw new Error(validateDate);

    // if last post / collection was created less than 10 seconds ago
    if (
      new Date().getTime() -
        parseInt(await LastPost({ userID: context.decoded.id })) <
      10000
    )
      throw new Error('you can create post every 10sec');

    if (input.photo.length === 0) throw new Error('No photo');

    const photos = await Promise.all(
      input.photo.map(async (photo, index: number) => {
        const { createReadStream, mimetype } = await photo;

        // check if file is image
        if (!mimetype.startsWith('image/'))
          throw new Error('file is not a image');

        const stream = await createReadStream();
        // await upload stream
        const buffer = await streamToPromise(stream);

        // downscale image
        const imageBuffer = await sharp(buffer)
          .resize(2560, undefined, { withoutEnlargement: true })
          // convert image format to jpeg
          .jpeg()
          .toBuffer();

        return { ...(await UploadPhoto(imageBuffer)), index };
      })
    );
    console.log('received, uploaded and validated');
    CreatePost({
      ...input,
      userID: context.decoded.id,
      photos,
    });

    return 'post created';
  },

  delete: async (
    _parent: undefined,
    { id }: { id: number },
    context: contextType
  ) => {
    OnlyLogged(context);
    return await Delete({ logged: context.decoded.id, id });
  },

  deleteUser: async (
    _parent: undefined,
    { input }: { input: { username: string; password: string } },
    context: contextType
  ) => {
    OnlyLogged(context);
    return DeleteUser(input);
  },

  verifyToken: async (_parent: undefined, { token }: { token: string }) =>
    await VerifyToken(token),

  follow: async (
    _parent: undefined,
    { userID }: { userID: number },
    context: contextType
  ) => {
    OnlyLogged(context);
    if (context.decoded.id == userID)
      throw new Error('You cannot follow yourself');

    return await Follow(context.decoded.id, userID);
  },

  unfollow: async (
    _parent: undefined,
    { userID }: { userID: number },
    context: contextType
  ) => {
    OnlyLogged(context);
    if (context.decoded.id == userID)
      throw new Error('You cannot unfollow yourself');
    return Unfollow(context.decoded.id, userID);
  },
};

export default mutations;
