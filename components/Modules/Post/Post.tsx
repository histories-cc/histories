import { motion } from 'framer-motion';
import Image from 'next/image';
import React, { useState } from 'react';
import { Blurhash } from 'react-blurhash';
import { useTranslation } from 'react-i18next';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi';
import { IoIosMore } from 'react-icons/io';

import { Maybe, Photo } from '../../../.cache/__types__';
import {
  useLikeMutation,
  useUnlikeMutation,
} from '../../../lib/graphql/relations.graphql';
import { LoginContext } from '../../../pages/_app';
import UrlPrefix from '../../../shared/config/UrlPrefix';
import { MiniUserCard } from '../tmp/MiniUserCard';
import Card from '../UserPage/Card';
import { AddToCollectionModal, LikePost, PostTimeline, UnlikePost } from '.';
import OptionsMenu from './OptionsMenu';

type PostProps = {
  author: {
    firstName: string;
    lastName: string;
    username: string;
    profile: string;
    id: number;
  };
  timeline?: boolean;
  photos?: Array<Photo>;
  createdAt: number;
  description?: Maybe<string>;
  likeCount: number;
  commentCount: number;
  postDate: number;
  liked: boolean;
  id: number;
};

const Post: React.FC<PostProps> = ({
  author,
  timeline,
  photos,
  createdAt,
  description,
  likeCount,
  commentCount,
  postDate,
  liked,
  id,
}) => {
  const loginContext = React.useContext(LoginContext);

  const [visible, setVisible] = useState<null | 'deleted'>(null); // show deleted card instead of post if post is deleted
  const [collectionSelectModal, setCollectionSelectModal] = useState(false);

  const [localLikeState, setLocalLikeState] = useState<boolean>(liked); // using local states to avoid refetching and provide faster response for user
  const { t } = useTranslation();
  const likeCountWithoutMe = likeCount - (liked ? 1 : 0); // number of likes without logged user

  // like and unlike mutations (they can only be created in the component (not in function))
  const [likeMutation] = useLikeMutation();
  const [unlikeMutation] = useUnlikeMutation();

  const onLike = async (type: string) => {
    // allow only when user is logged in
    if (loginContext.data?.me?.id)
      // runs like mutation and changes local states
      await LikePost({
        localLikeState,
        id,
        likeMutation,
        setLocalLikeState,
      });
  };

  const onUnlike = async () => {
    // allow only when user is logged in
    if (loginContext.data?.me?.id)
      // runs unlike mutation and changes local states
      await UnlikePost({
        localLikeState,
        id,
        unlikeMutation,
        setLocalLikeState,
      });
  };

  if (visible === 'deleted')
    return (
      <Card>
        <div>{t('post_deleted')}</div>
      </Card>
    );

  return (
    <>
      <AddToCollectionModal
        isOpen={collectionSelectModal}
        postId={id}
        setOpenState={setCollectionSelectModal}
      />
      <PostTimeline time={postDate} show={timeline}>
        <div className="w-full mb-4 bg-white border dark:border-[#373638] dark:bg-[#2b2b2b] sm:rounded-2xl max-w-[600px]">
          <div className="flex items-center justify-between px-4 pt-6">
            <MiniUserCard {...author} time={createdAt} />
            <OptionsMenu id={id} author={author} setVisible={setVisible}>
              <IoIosMore className="text-2xl" />
            </OptionsMenu>
          </div>
          <p className="px-4 pt-2 font-medium">{description}</p>
          {photos && (
            <div className="relative w-full bg-white cursor-pointer dark:bg-black h-[360px] bg-secondary">
              <div className="flex items-center justify-center w-full h-full">
                <Blurhash
                  hash={photos[0].blurhash}
                  width={
                    photos[0].width > photos[0].height
                      ? 405
                      : (photos[0].width / photos[0].height) * 360
                  }
                  height={
                    photos[0].height > photos[0].width
                      ? 360
                      : (photos[0].height / photos[0].width) * 360
                  }
                  punch={1}
                />
              </div>

              <Image
                src={UrlPrefix + photos[0].hash}
                layout="fill"
                objectFit="contain"
                placeholder="blur"
                blurDataURL={'https://ipfs.io/ipfs' + photos[0].hash}
                objectPosition="center"
                alt="Profile picture"
              />
            </div>
          )}
          <div className={`px-4 relative ${photos ? '' : 'pt-4 '}`}>
            <div className="flex items-center justify-around w-full pt-1 pb-2 border-t border-gray-300">
              <div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={async () => {
                    if (localLikeState) await onUnlike();
                    else await onLike('like');
                  }}
                >
                  <a className="flex items-center text-base gap-1">
                    <span className="text-red-500">
                      {localLikeState ? <HiHeart /> : <HiOutlineHeart />}
                    </span>
                    {likeCountWithoutMe + (localLikeState ? 1 : 0)}{' '}
                    {t('likes_count')}
                  </a>
                </motion.button>
              </div>
              <div className="flex items-center text-base gap-2">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="far"
                    data-icon="comment-alt"
                    className="w-4 h-4"
                    role="img"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="currentColor"
                      d="M448 0H64C28.7 0 0 28.7 0 64v288c0 35.3 28.7 64 64 64h96v84c0 7.1 5.8 12 12 12 2.4 0 4.9-.7 7.1-2.4L304 416h144c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64zm16 352c0 8.8-7.2 16-16 16H288l-12.8 9.6L208 428v-60H64c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16h384c8.8 0 16 7.2 16 16v288z"
                    />
                  </svg>
                </span>
                <span>{`${commentCount} ${t('comments_count')}`} </span>
              </div>
              <div className="flex items-center text-base gap-2">
                <span onClick={() => setCollectionSelectModal(true)}>
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="far"
                    data-icon="bookmark"
                    className="w-4 h-4"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                  >
                    <path
                      fill="currentColor"
                      d="M336 0H48C21.49 0 0 21.49 0 48v464l192-112 192 112V48c0-26.51-21.49-48-48-48zm0 428.43l-144-84-144 84V54a6 6 0 0 1 6-6h276c3.314 0 6 2.683 6 5.996V428.43z"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </PostTimeline>
    </>
  );
};

export default Post;
