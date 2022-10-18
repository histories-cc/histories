import React from 'react';
import useTranslation from 'next-translate/useTranslation';

// COLUMN
interface IColumnProps {
  title: string;
  value?: number;
  loading?: boolean;
}

const Column: React.FC<IColumnProps> = ({ title, value, loading }) => {
  return (
    <div className="grid justify-items-center">
      {loading ? (
        <div className="mt-4 bg-disabled h-8 w-[50px] rounded-classic animate-pulse" />
      ) : (
        <a className="font-semibold text-dark">{value}</a>
      )}
      <a className="font-semibold text-subtle">{title}</a>
    </div>
  );
};

// PROFILE STATS
export interface IProfileStatsProps {
  followers: number;
  following: number;
  posts: number;
  loading?: boolean;
}

const ProfileStats: React.FC<IProfileStatsProps> = ({
  followers,
  following,
  posts,
}) => {
  // hooks
  const { t } = useTranslation('common');

  // variables
  const translationPrefix = 'profile.stats';

  return (
    <div className="flex justify-between w-[300px]">
      <Column value={followers} title={t(`${translationPrefix}.followers`)} />
      <Column value={following} title={t(`${translationPrefix}.following`)} />
      <Column value={posts} title={t(`${translationPrefix}.posts`)} />
    </div>
  );
};

export default ProfileStats;
