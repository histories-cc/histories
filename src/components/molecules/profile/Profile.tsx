import { Avatar } from '../../atoms';
import Link from 'next/link';
import React from 'react';
import ProfileStats, { IProfileStatsProps } from './Stats';

interface IProfileProps extends IProfileStatsProps {
  firstName: string;
  lastName?: string;
  username: string;
}

const Profile: React.FC<IProfileProps> = ({
  followers,
  following,
  posts,
  firstName,
  lastName,
  username,
  loading,
}) => {
  return (
    <div className="grid justify-items-center w-[400px]">
      {/* PROFILE PICTURE */}
      <Link href={`/u/${username}/png`} passHref>
        <div>
          <Avatar src={`https://avatars.dicebear.com/api/initials/${firstName}-${lastName||""}.svg`} size="4xl" loading={loading} />
        </div>
      </Link>

      {/* SPACING */}
      <div className="h-6" />

      {/* NAME */}
      {loading ? (
        <>
          <div className="bg-disabled h-8 w-[320px] rounded-classic animate-pulse" />
          <div className="mt-4 bg-disabled h-8 w-[270px] rounded-classic animate-pulse" />
        </>
      ) : (
        <>
          <h3>{`${firstName} ${lastName}`}</h3>
          <h6 className="text-subtle">{`@${username}`}</h6>
        </>
      )}
      {/* SPACING */}
      <div className="h-6" />
      <ProfileStats {...{ followers, following, posts, loading }} />
    </div>
  );
};
export default Profile;
