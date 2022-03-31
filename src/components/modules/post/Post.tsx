import AddToCollectionModal from '@components/modules/modals/AddToCollectionModal';
import { useLikeMutation, useUnlikeMutation } from '@graphql';
import UrlPrefix from '@src/constants/IPFSUrlPrefix';
import MeContext from '@src/contexts/MeContext';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { Blurhash } from 'react-blurhash';
import { useTranslation } from 'react-i18next';
import { BiMessage } from 'react-icons/bi';
import { HiOutlineHeart } from 'react-icons/hi';
import { IoIosMore } from 'react-icons/io';
import TimeAgo from 'react-timeago';

import { Maybe, Photo } from '../../../../src/graphql/index';
import Card from '../userPage/Card';
import { LikePost, UnlikePost } from '.';
import OptionsMenu from './OptionsMenu';

type PostProps = {
  author: {
    firstName: string;
    lastName?: string | null;
    username: string;
    profile: string;
    id: number;
  };
  timeline?: boolean;
  photos?: Array<Photo>;
  createdAt: number;
  nsfw: boolean;
  description?: Maybe<string>;
  likeCount: number;
  commentCount: number;
  startYear: number;
  startMonth?: number | null;
  startDay?: number | null;
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
  startYear,
  startMonth,
  startDay,
  liked,
  nsfw,
  id,
}) => {
  const meContext = React.useContext(MeContext);

  const [visible, setVisible] = useState<null | 'deleted'>(null); // show deleted card instead of post if post is deleted
  const [collectionSelectModal, setCollectionSelectModal] = useState(false);
  const [localLikeState, setLocalLikeState] = useState<boolean>(liked); // using local states to avoid refetching and provide faster response for user
  const { t } = useTranslation();
  const likeCountWithoutMe = likeCount - (liked ? 1 : 0); // number of likes without logged user
  const [showImage, setShowImage] = useState<boolean>(false);
  const [isNsfw, setIsNsfw] = useState<boolean>(nsfw);

  // like and unlike mutations (they can only be created in the component (not in function))
  const [likeMutation] = useLikeMutation();
  const [unlikeMutation] = useUnlikeMutation();

  const onLike = async (type: string) => {
    // allow only when user is logged in
    if (meContext.isLoggedIn)
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
    if (meContext.isLoggedIn)
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
      <div className="w-full mb-4 bg-white border dark:border-[#373638] dark:bg-[#2b2b2b] sm:rounded-2xl max-w-[600px]">
        <div className="flex items-center justify-between px-4 pt-6">
          <div className="flex items-center gap-3">
            <Link href={'/user/' + author.username} passHref>
              <div className="relative w-10 h-10 rounded-full cursor-pointer bg-secondary">
                <Image
                  src={
                    author.profile.startsWith('http')
                      ? author.profile
                      : UrlPrefix + author.profile
                  }
                  layout="fill"
                  objectFit="contain"
                  objectPosition="center"
                  className="rounded-full"
                  alt="Profile picture"
                />
              </div>
            </Link>
            <div className="relative flex flex-col">
              <Link href={'/user/' + author.username}>
                <a className="text-lg font-semibold cursor-pointer">
                  {author.firstName} {author.lastName}
                </a>
              </Link>
              <a className="cursor-pointer opacity-80">
                @{author.username}
                {' · '}
                <TimeAgo date={createdAt} />
              </a>
            </div>
          </div>
          <OptionsMenu
            id={id}
            author={author}
            setVisible={setVisible}
            nsfw={isNsfw}
            setIsNsfw={setIsNsfw}
          >
            <IoIosMore className="text-2xl" />
          </OptionsMenu>
        </div>
        <p className="px-4 pt-2 font-medium">{description}</p>

        {photos && (
          <div className="relative w-full bg-white cursor-pointer dark:bg-black h-[360px] bg-secondary">
            <Link href={`/post/${id}`} passHref>
              <div>
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
                  alt="Post photo"
                />
              </div>
            </Link>
            {/* NSFW accept */}
            {isNsfw &&
              (showImage ? (
                <button
                  className="absolute text-black right-4 bottom-4"
                  onClick={() => setShowImage(false)}
                >
                  {t('hide')}
                </button>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center backdrop-blur-2xl bg-black/40">
                  <div className="text-center text-white">
                    <div className="text-2xl">{t('nsfw_warning')}</div>
                    <div className="text-lg">
                      {t('nsfw_warning_description')}
                    </div>
                    <div className="mt-4">
                      <button
                        className="px-4 py-2 font-semibold text-white rounded-full bg-secondary"
                        onClick={() => setShowImage(true)}
                      >
                        {t('show_image')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
        <div className={`px-4 relative ${photos ? '' : 'pt-4 '}`}>
          <div className="flex items-center justify-around w-full pt-1 pb-2 border-t border-gray-300">
            <div className="flex items-center text-base gap-1">
              <motion.button
                whileTap={{ scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                onClick={async () => {
                  if (localLikeState) await onUnlike();
                  else await onLike('like');
                }}
              >
                <HiOutlineHeart
                  className={`w-5 h-5 ${
                    localLikeState
                      ? 'fill-red-500 stroke-red-500'
                      : 'stroke-black'
                  }`}
                />
              </motion.button>
              {likeCountWithoutMe + (localLikeState ? 1 : 0)} {t('likes_count')}
            </div>
            <div className="flex items-center text-base gap-2">
              <Link href={`/post/${id}`} passHref>
                <BiMessage className="w-5 h-5 cursor-pointer" />
              </Link>
              <a>{`${commentCount} ${t('comments_count')}`} </a>
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
    </>
  );
};

export default Post;
