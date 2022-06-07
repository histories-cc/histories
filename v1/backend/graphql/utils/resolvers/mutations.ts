import sharp from 'sharp';
import streamToPromise from 'stream-to-promise';
import validator from 'validator';

import {
  CreateCollectionInput,
  CreateCommentInput,
  CreatePostInput,
  CreateUserInput,
  EditPlaceInput,
  EditPostInput,
  LoginInput,
  Mutation,
  ResetPasswordInput,
  UpdateProfileInput,
} from '../../../../src/graphql/index';
import {} from '../../../../shared/validation';
import {
  IsValidComment,
  IsValidHistoricalDate,
} from '../../../../shared/validation/InputValidation';
import UrlPrefix from '../../../../src/constants/IPFSUrlPrefix';
import { GenerateBlurhash, NSFWCheck } from '../../../functions';
import { UploadPhoto } from '../../../ipfs';
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
  VerifyToken,
} from '../../resolvers';
import LastPost from '../../resolvers/lastPost';
import EditPlaceMutation from '../../resolvers/place/mutations/EditPlaceMutation';
import ForgotPassword from '../../resolvers/user/mutations/ForgotPassword';
import ResetPassword from '../../resolvers/user/mutations/ResetPassword';
import { contextType, OnlyLogged } from './resolvers';
import EditPost from '../../resolvers/post/mutations/EditPost';

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

  login: async (
    _parent: undefined,
    { input }: { input: LoginInput }
  ): Promise<Mutation['login']> => await Login(input),

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
  ): Promise<Mutation['addToCollection']> => {
    OnlyLogged(context);
    return await AddPostToCollection({
      ...input,
      userId: context.decoded.id,
    });
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
  ): Promise<Mutation['updateProfile']> => {
    OnlyLogged(context);

    return await EditUser(input, context.decoded.id);
  },

  createComment: async (
    _parent: undefined,
    { input: { target, content } }: { input: CreateCommentInput },
    context: contextType
  ): Promise<Mutation['createComment']> => {
    OnlyLogged(context);

    return await CreateComment({
      targetID: target,
      authorID: context.decoded.id,
      content,
    });
  },

  createUser: async (
    _parent: undefined,
    {
      input,
    }: {
      input: CreateUserInput;
    }
  ): Promise<Mutation['createUser']> => await CreateUser(input),

  createCollection: async (
    _parent: undefined,
    {
      input,
    }: {
      input: CreateCollectionInput;
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
  ): Promise<Mutation['createPost']> => {
    OnlyLogged(context);

    if (
      input.placeID == null &&
      !validator.isLatLong(`${input.latitude},${input.longitude}`)
    )
      throw new Error('Invalid coordinates');

    if (input.description && !IsValidComment(input.description))
      throw new Error('Invalid description');

    const historicalDate = IsValidHistoricalDate(input);

    if (input.photo.length < 1) throw new Error('Invalid photos');

    const photos: Array<{
      hash: string;
      blurhash: string;
      width: number;
      height: number;
      index: number;
      containsNSFW: boolean;
    }> =
      input?.photo == undefined
        ? []
        : await Promise.all(
            input?.photo.slice(0, 5).map(async (photo, index: number) => {
              const { createReadStream, mimetype } = await photo;

              // check if file is image
              if (!mimetype.startsWith('image/'))
                throw new Error('file is not a image');

              const originalBuffer: Buffer = await streamToPromise(
                createReadStream()
              ); // await upload stream

              const newBuffer: Promise<Buffer> = sharp(originalBuffer)
                .resize(2560, undefined, { withoutEnlargement: true })
                .jpeg()
                .toBuffer(); // downscale image and convert it to JPEG

              async function UploadToIPFSAndNSFWCheck(buffer: Buffer): Promise<{
                hash: string;
                width: number;
                height: number;
                containsNSFW: boolean;
              }> {
                const photoData = await UploadPhoto(buffer); // upload photo to IPFS and get hash
                // only check if all photos so far are not NSFW

                const res = await NSFWCheck(UrlPrefix + photoData.hash); //get result from API
                const containsNSFW: boolean = res !== undefined && res > 0.8; // if NSFW probability is more than 0.8 out of 1 set NSFW to true

                return { ...photoData, containsNSFW };
              }

              // run blurhash generation and upload to IPFS concurrently
              const [blurhash, photoData]: [
                string,
                {
                  hash: string;
                  width: number;
                  height: number;
                  containsNSFW: boolean;
                }
              ] = await Promise.all([
                GenerateBlurhash(originalBuffer),
                UploadToIPFSAndNSFWCheck(await newBuffer),
              ]);

              return { ...photoData, blurhash, index };
            })
          );

    const containsNSFW = photos.some((photo) => photo.containsNSFW);

    return await CreatePost({
      startDay: historicalDate.startDay,
      startMonth: historicalDate.startMonth,
      startYear: historicalDate.startYear,
      endDay: historicalDate.endDay,
      endMonth: historicalDate.endMonth,
      endYear: historicalDate.endYear,
      place: {
        id: input.placeID ?? null,
        latitude: input.latitude ?? null,
        longitude: input.longitude ?? null,
      },
      description: input.description ?? '',
      userID: context.decoded.id,
      nsfw: containsNSFW,
      photos,
    });
  },

  editPost: async (
    _parent: undefined,
    {
      input,
    }: {
      input: EditPostInput;
    },
    context: contextType
  ): Promise<Mutation['editPost']> => {
    OnlyLogged(context);
    return await EditPost({
      ...input,
      userID: context.decoded.id,
    });
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

  editPlace: async (
    _parent: undefined,
    { input }: { input: EditPlaceInput },
    context: contextType
  ) => {
    OnlyLogged(context);

    return await EditPlaceMutation({
      userId: context.decoded.id,
      placeId: input.id,
      name: input.name || '',
      description: input.description || '',
    });
  },
};

export default mutations;
