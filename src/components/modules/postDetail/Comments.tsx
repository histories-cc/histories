import { Input, Loading, Tooltip } from '@components/elements';
import StringWithMentions from '@components/elements/StringWithMentions';
import { useCreateCommentMutation } from '@graphql';
import { useLikeMutation, useUnlikeMutation } from '@graphql';
import { usePostCommentsQuery } from '@graphql';
import { PostQuery } from '@graphql';
import UrlPrefix from '@src/constants/IPFSUrlPrefix';
import MeContext from '@src/contexts/MeContext';
import i18n from '@src/translation/i18n';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useState } from 'react';
import { Blurhash } from 'react-blurhash';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  HiOutlineCalendar,
  HiOutlineHeart,
  HiOutlineLocationMarker,
  HiOutlinePlusCircle,
  HiPaperAirplane,
} from 'react-icons/hi';
import TimeAgo from 'react-timeago';

import { IsValidComment } from '../../../../shared/validation/InputValidation';

interface PostDetailCommentSectionProps {
  post: PostQuery['post'];
}

interface CreateCommentFormInput {
  content: string;
}

const PostDetailCommentSection: React.FC<PostDetailCommentSectionProps> = ({
  post,
}) => {
  const meContext = useContext(MeContext); // me context
  const { register, handleSubmit, reset } = useForm<CreateCommentFormInput>(); // create comment form
  const [createCommentMutation] = useCreateCommentMutation(); // create comment mutation
  const { t } = useTranslation(); // i18n
  const likeCountWithoutMe = post.likeCount - (post.liked ? 1 : 0); // like count withou me
  const [likeMutation] = useLikeMutation();
  const [unlikeMutation] = useUnlikeMutation();
  const [localLikeState, setLocalLikeState] = useState<boolean>(post.liked);

  async function OnLike(id: number, type: string) {
    if (!meContext.isLoggedIn) return;
    // runs like mutation and changes local states
    // try
    try {
      if (localLikeState) return; // if user already liked post before return
      setLocalLikeState(true); // change localLikeState
      await likeMutation({ variables: { id, type } }); // call graphql mutation
    } catch (error: any) {
      // throw error if mutation wasn't successful
      toast.error(error.message);
      // refetch data
      // (localStates will have wrong value)
      // (possibility that post was deleted)
      // await refetch();
    }
  }

  async function OnUnlike(id: number) {
    if (!meContext.isLoggedIn) return;
    // try
    try {
      if (!localLikeState) return; // if user didn't like post before return
      setLocalLikeState(false); // change localLikeState
      await unlikeMutation({ variables: { id } }); // call graphql mutation
    } catch (error: any) {
      // throw error if mutation wasn't successful
      toast.error(error.message);
      // refetch data
      // (localStates will have wrong value)
      // (possibility that post was deleted)
      // await refetch();
    }
  }
  const commentsQuery = usePostCommentsQuery({
    variables: {
      input: { skip: 0, take: 1000, sort: 'ASC', targetID: post.id },
    },
  });

  async function OnSubmit(data: CreateCommentFormInput) {
    try {
      await createCommentMutation({
        variables: { input: { content: data.content, target: post.id } },
      });
      reset();
      commentsQuery.refetch();
    } catch (error: any) {
      toast.error(t('something went wrong'));
    }
  }

  return (
    <div className="h-full p-2 overflow-y-auto bg-zinc-100">
      <div className="flex bg-white border border-gray-200 p-0.5 rounded-xl shadow-sm w-full lg:hidden">
        <div className="relative w-20 h-20 rounded-xl aspect-square">
          <Blurhash
            hash={post.place.preview!.blurhash}
            height="100%"
            width="100%"
            className="rounded-xl blurhash"
            punch={1}
          />
          <Image
            src={UrlPrefix + post.place.preview?.hash}
            layout="fill"
            objectFit="cover"
            className="rounded-xl"
            alt="Image of the place"
          />
        </div>
        <div className="flex flex-col items-center w-full h-20 overflow-y-hidden p-1.5">
          <a className="font-semibold">{post.place.name}</a>
          <div className="flex justify-center py-2 gap-2">
            <Link
              href={`/?lat=${post.place.latitude}&lng=${post.place.longitude}&zoom=28.5&place=${post.place.id}`}
            >
              <a className="flex items-center px-2 py-1 rounded-lg gap-1.5 hover:bg-gray-100">
                <HiOutlineLocationMarker /> {t('show_on_map')}
              </a>
            </Link>
            {meContext.data?.me && (
              <Link href={`/create/post?placeID=${post.place.id}`}>
                <a className="flex items-center px-2 py-1 rounded-lg gap-1.5 hover:bg-gray-100">
                  <HiOutlinePlusCircle />
                  {t('add_photo')}
                </a>
              </Link>
            )}
          </div>
        </div>
      </div>
      {/* AUTHOR */}
      <div className="p-2 mt-1 bg-white border border-gray-200 rounded-xl">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Link href={`/user/${post.author.username}`} passHref>
              <div className="relative w-10 h-10 rounded-full aspect-square">
                <Image
                  src={
                    post.author.profile.startsWith('http')
                      ? post.author.profile
                      : UrlPrefix + post.author.profile
                  }
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                  alt="Profile picture"
                />
              </div>
            </Link>
            <div className="flex flex-col w-full">
              <Link href={`/user/${post.author.username}`}>
                <a className="text-lg font-semibold">{`${post.author.firstName} ${post.author?.lastName}`}</a>
              </Link>
              <div className="flex items-center justify-between w-full">
                <Link href={`/user/${post.author.username}`}>
                  <a>@{post.author.username}</a>
                </Link>
                <a className="text-gray-600 font-xs">
                  {new Date(post.createdAt).toLocaleDateString('cs', {
                    day: 'numeric',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </a>
              </div>
            </div>
          </div>
          {/* DESCRIPTION */}
          <p className="px-4 pt-2"> {post.description}</p>
          {/* HISTORICAL DATE */}
          <div className="flex items-center m-auto font-semibold w-fit gap-2">
            <Tooltip text={t('see_posts_from_this_time_period')}>
              <Link
                href={`/?lat=49.3268&lng=15.2991&zoom=6.1771&minYear=${
                  post.startYear === post.endYear
                    ? post.endYear - 20
                    : post.startYear
                }&maxYear=${
                  post.startYear === post.endYear
                    ? post.endYear + 20
                    : post.endYear
                }&place=${post.place.id}`}
                passHref
              >
                <HiOutlineCalendar />
              </Link>
            </Tooltip>

            <span>
              {post.startDay && `${post.startDay}. `}
              {post.startMonth &&
                `${new Date(0, post.startMonth, 0).toLocaleString(
                  i18n.language,
                  {
                    month: 'long',
                  }
                )} `}
              {post.startYear}
            </span>
            {(post.startDay !== post.endDay ||
              post.startMonth !== post.endMonth ||
              post.startYear !== post.endYear) && (
              <>
                -
                <span>
                  {post.endDay && `${post.endDay}. `}
                  {post.endMonth &&
                    `${new Date(0, post.endMonth, 0).toLocaleString(
                      i18n.language,
                      {
                        month: 'long',
                      }
                    )} `}
                  {post.endYear}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between w-full py-1">
        {/* LIKES */}
        <div className="flex items-center ml-1 gap-1">
          <motion.button
            whileTap={{ scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              // if user is not logged in
              if (meContext.data === undefined) return;
              // if post is liked, unlike
              if (localLikeState) OnUnlike(post.id);
              // if post is not liked, like
              else OnLike(post.id, 'like');
            }}
          >
            <HiOutlineHeart
              className={`w-7 h-7 ${
                localLikeState
                  ? 'fill-brand stroke-brand'
                  : 'fill-zinc-400 stroke-zinc-400'
              }`}
            />
          </motion.button>
          <span className={localLikeState ? 'text-brand' : 'text-zinc-400'}>
            {likeCountWithoutMe + (localLikeState ? 1 : 0)}
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-between">
        {/* COMMENTS */}
        {((commentsQuery.data?.comments || []).length > 0 ||
          commentsQuery.loading) && (
          <div className="h-full">
            <span className="font-semibold">{t('comments')}:</span>

            {/* TBD: infinite scroll */}
            <div className="w-full">
              {commentsQuery.loading ? (
                <Loading />
              ) : (
                commentsQuery.data?.comments.map((comment) => {
                  return (
                    <div
                      key={comment?.id}
                      className="flex items-end pb-4 gap-2"
                    >
                      <Link href={`/user/${comment?.author.username}`} passHref>
                        <div className="relative w-10 h-10 rounded-full aspect-square">
                          <Image
                            src={
                              comment?.author?.profile.startsWith('http')
                                ? comment.author.profile
                                : UrlPrefix + comment?.author.profile
                            }
                            layout="fill"
                            objectFit="cover"
                            className="rounded-full"
                            alt="Profile picture"
                          />
                        </div>
                      </Link>
                      <div className="flex flex-col p-2 bg-white border border-gray-200 rounded-t-lg rounded-r-lg w-fit">
                        <span className="text-sm font-semibold">
                          <Link href={`/user/${comment?.author.username}`}>
                            {`${comment.author.firstName} ${comment.author?.lastName}`}
                          </Link>
                          {' · '}
                          <TimeAgo date={comment.createdAt} />
                        </span>
                        <div className="break-all">
                          <StringWithMentions text={comment?.content} />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
        {/* CREATE COMMENT FORM */}
        {meContext.isLoggedIn && (
          <form onSubmit={handleSubmit(OnSubmit)}>
            <Input
              register={register}
              name="content"
              options={{
                required: true,
                validate: (value) => IsValidComment(value),
                maxLength: 1000,
              }}
              label={t('create_comment')}
              rightIcon={
                <button type="submit">
                  <HiPaperAirplane className="text-brand transform rotate-90 w-7 h-7 hover:scale-95 ease-in-out hover:text-blue-600" />
                </button>
              }
            />
          </form>
        )}
      </div>
    </div>
  );
};

export default PostDetailCommentSection;
