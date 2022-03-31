import { Button, Tooltip } from '@components/elements';
import { useFollowMutation, useUnfollowMutation } from '@graphql';
import UrlPrefix from '@src/constants/IPFSUrlPrefix';
import MeContext from '@src/contexts/MeContext';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { HiBadgeCheck } from 'react-icons/hi';

import { Maybe } from '../../../../../src/graphql/index';

export type UserLeftPanelProps = {
  user: {
    id: number;
    username: string;
    firstName: string;
    lastName?: string | null;
    profile: string;
    verified: boolean;

    createdAt: string;
    followerCount: number;
    followingCount: number;
    postCount: number;

    bio: Maybe<string>;
    isFollowing: boolean;
  };
};

const UserLeftPanel: React.FC<UserLeftPanelProps> = ({ user }) => {
  const [follow] = useFollowMutation(); // follow mutation
  const [unfollow] = useUnfollowMutation(); // unfollow mutation
  // save numbers to variables so I can update data on user page without refetching
  const [localFollowingState, setLocalFollowingState] = useState<boolean>(
    user.isFollowing
  );
  // number of followers without logged user to possibility of updating data without refetching
  const followerCountWithoutMe =
    user.followerCount - (user.isFollowing ? 1 : 0);

  const meContext = React.useContext(MeContext);
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center md:fixed top-24 lg:col-span-4 md:col-span-12 col-span-full">
      {/* PROFILE PICTURE */}
      <Link href={`/user/${user.username}/profile`} passHref>
        <div className="relative w-32 h-32 rounded-full md:w-48 md:h-48 transition-all duration-400 ease-in-out">
          <Image
            src={
              user.profile.startsWith('http')
                ? user.profile
                : UrlPrefix + user.profile
            }
            layout="fill"
            objectFit="contain"
            objectPosition="center"
            className="rounded-full"
            alt="Profile picture"
            quality={50}
          />
        </div>
      </Link>
      {/* PROFILE INFO */}
      {/* NAME */}
      <h1 className="flex items-center pt-2 text-2xl font-bold gap-1.5">
        {user.firstName} {user?.lastName}
        {/* NEW USER BADGE */}
        {new Date().getTime() - new Date(user.createdAt).getTime() <
          129600000 && (
          <Tooltip text="This account was created less than 2 days ago">
            <div className="items-center block px-3 py-1 text-xs font-semibold text-green-500 bg-white border border-green-500 rounded-full space-x-1.5 dark:bg-gray-800 shadown-sm dark:border-gray-700 w-max">
              {t('new_user')}
            </div>
          </Tooltip>
        )}
        {user.verified && (
          <Tooltip text={t('verified_user')}>
            <HiBadgeCheck className="text-brand" />
          </Tooltip>
        )}
      </h1>
      {/* USERNAME */}
      <Link href={'/' + user.username} passHref>
        <a className="w-full text-xl font-semibold text-center text-zinc-400 dark:text-gray-300">
          @{user.username}
        </a>
      </Link>

      <div className="flex pt-4 gap-8">
        {/* FOLLOWERS COUNT */}
        <div className="flex flex-col text-base">
          <span className="font-semibold text-center text-black">
            {followerCountWithoutMe + (localFollowingState ? 1 : 0)}
          </span>
          <span className="font-semibold text-zinc-400">{t('followers')}</span>
        </div>
        {/* FOLLOWING COUNT */}
        <h4 className="flex flex-col text-base">
          <span className="font-semibold text-center text-black">
            {user.followingCount}
          </span>
          <span className="font-semibold text-zinc-400">{t('following')}</span>
        </h4>
        {/* POSTS COUNT */}
        <h4 className="flex flex-col text-base">
          <span className="font-semibold text-center text-black">
            {user.postCount}
          </span>
          <span className="font-semibold text-zinc-400">{t('post_count')}</span>
        </h4>
      </div>

      {/* BIO */}
      <p className="mt-4 font-medium text-black dark:text-white">{user.bio}</p>
      {meContext.data?.me?.id === user.id ? (
        <Link href="/settings" passHref>
          <Button size="sm">{t('edit_profile')}</Button>
        </Link>
      ) : (
        meContext.data?.me?.id && (
          <Button
            size="sm"
            onClick={async () => {
              try {
                // if following, run unfollow mutation
                if (localFollowingState) {
                  setLocalFollowingState(false); // change local state to avoid refetch
                  await unfollow({
                    variables: {
                      userID: user.id,
                    },
                  });
                }
                // if not following, run follow mutation
                else {
                  setLocalFollowingState(true); // change local state to avoid refetch
                  await follow({
                    variables: {
                      userID: user.id,
                    },
                  });
                }
              } catch (error: any) {
                toast.error(error.message);
              }
            }}
          >
            {localFollowingState ? t('unfollow') : t('follow')}
          </Button>
        )
      )}
    </div>
  );
};

export default UserLeftPanel;
