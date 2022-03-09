import sharp from 'sharp';
import streamToPromise from 'stream-to-promise';

import {
  CreateCollectionInput,
  CreateCommentInput,
  CreatePostInput,
  CreateUserInput,
  LoginInput,
  Mutation,
  ResetPasswordInput,
  UpdateProfileInput,
} from '../../../../.cache/__types__';
import {
  ValidateCoordinates,
  ValidateDescription,
} from '../../../../shared/validation';
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
import ForgotPassword from '../../resolvers/user/mutations/ForgotPassword';
import ResetPassword from '../../resolvers/user/mutations/ResetPassword';
import { contextType, OnlyLogged } from './resolvers';

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
      input.placeID == undefined &&
      (input.latitude == undefined || input.longitude == undefined)
    )
      throw new Error('You must provide a placeId or latitude and longitude');

    if (input.placeID == undefined) {
      // check coordinates
      const validateCoordinates = ValidateCoordinates([
        input.latitude!,
        input.longitude!,
      ]).error;
      if (validateCoordinates) throw new Error(validateCoordinates);
    }

    // check description
    if (input.description) {
      const validateDescription = ValidateDescription(input.description).error;
      if (validateDescription) throw new Error(validateDescription);
    }

    // if last post / collection was created less than 10 seconds ago
    if (
      new Date().getTime() -
        parseInt(await LastPost({ userID: context.decoded.id })) <
      10000
    )
      throw new Error('you can create post every 10sec');

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
            input?.photo.map(async (photo, index: number) => {
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
                console.log(res, UrlPrefix + photoData.hash);
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
      // @ts-ignore // idk why this doesn't work
      place: {
        id: input.placeID ?? null,
        latitude: input.latitude ?? null,
        longitude: input.longitude ?? null,
      },
      description: input.description ?? '',
      startDay: input.startDay,
      startMonth: input.startMonth,
      startYear: input.startYear,
      endDay: input.endDay,
      endMonth: input.endMonth,
      endYear: input.endYear,

      userID: context.decoded.id,
      nsfw: containsNSFW,
      photos,
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
};

export default mutations;
