import { motion } from 'framer-motion';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Blurhash } from 'react-blurhash';
import { IoIosMore } from 'react-icons/io';

import {
  useLikeMutation,
  useUnlikeMutation,
} from '../../../lib/graphql/relations.graphql';
import { LoginContext } from '../../../pages/_app';
import UrlPrefix from '../../../shared/config/UrlPrefix';
import { MiniUserCard } from '../tmp/MiniUserCard';
import Card from '../UserPage/Card';
import {
  AddToCollectionModal,
  LikePost,
  PostProps,
  PostTimeline,
  UnlikePost,
} from '.';
import OptionsMenu from './OptionsMenu';

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
  refetch,
}) => {
  const loginContext = React.useContext(LoginContext);

  const [visible, setVisible] = useState<null | 'deleted'>(null);
  const [collectionSelectModal, setCollectionSelectModal] = useState(false);

  // using local states to avoid refetching and provide faster response for user
  const [localLikeState, setLocalLikeState] = useState<string | null>(liked);
  const [localLikeCount, setLocalLikeCount] = useState<number>(likeCount);

  // like and unlike mutations
  const [likeMutation] = useLikeMutation();
  const [unlikeMutation] = useUnlikeMutation();

  // on refetch reset local states to value from graphql query
  useEffect(() => {
    setLocalLikeCount(likeCount);
  }, [likeCount]);

  useEffect(() => {
    setLocalLikeState(liked);
  }, [liked]);

  const onLike = async (type: string) => {
    // allow only when user is logged in
    if (loginContext.data?.me?.id)
      // runs like mutation and changes local states
      await LikePost({
        type,
        localLikeCount,
        localLikeState,
        id,
        likeMutation,
        refetch,
        setLocalLikeCount,
        setLocalLikeState,
      });
  };

  const onUnlike = async () => {
    // allow only when user is logged in
    if (loginContext.data?.me?.id)
      // runs unlike mutation and changes local states
      await UnlikePost({
        localLikeCount,
        localLikeState,
        id,
        unlikeMutation,
        refetch,
        setLocalLikeCount,
        setLocalLikeState,
      });
  };

  if (visible === 'deleted')
    return (
      <Card>
        <div>This post was deleted</div>
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
              <Blurhash
                hash={photos[0].blurhash}
                width={598}
                height={(598 / photos[0].width) * photos[0].height}
                punch={1}
              />

              <Image
                src={UrlPrefix + photos[0].hash}
                layout="fill"
                objectFit="contain"
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
                    {
                      <span className="text-red-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            fill={
                              localLikeState == 'like' ? 'currentColor' : 'none'
                            }
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          ></path>
                        </svg>
                      </span>
                    }
                    {localLikeCount} stars
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
                <span>{`${commentCount} comments`} </span>
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
