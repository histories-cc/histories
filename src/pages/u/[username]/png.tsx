import React from 'react';
import { GetServerSidePropsContext } from 'next';
import { useTranslation } from 'react-i18next';
import { useUserProfileQuery } from '@graphql';

interface IUserPageProps {
  username: string;
}

const UserPage: React.FC<IUserPageProps> = ({ username }) => {
  // hooks
  const { t } = useTranslation();
  const { data, loading } = useUserProfileQuery({
    variables: {
      username,
    },
  });

  if (loading) {
    return <div>{t('loading')}</div>;
  }

  return <img src="https://i.pravatar.cc" alt={t('translation:avatar:alt')} />;
};

export default UserPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return {
    props: {
      username: ctx.query.username,
    },
  };
};
