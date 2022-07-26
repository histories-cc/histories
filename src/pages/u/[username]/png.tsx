import React from 'react';
import { GetServerSidePropsContext } from 'next';
import { useTranslation } from 'react-i18next';

interface IUserPageProps {
  username: string;
}

const UserPage: React.FC<IUserPageProps> = ({ username }) => {
  const { t } = useTranslation();

  return <img src="https://i.pravatar.cc" />;
};

export default UserPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return {
    props: {
      username: ctx.query.username,
    },
  };
};
