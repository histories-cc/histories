import React from 'react';
import { GetServerSidePropsContext } from 'next'; 
import { UserProfilePictureDocument, } from '@graphql';
import client from '@src/services/apollo';

interface IUserPageProps {
  url: string;
}

const UserPage: React.FC<IUserPageProps> = ({ url, }) => {
  return <img src={url} />;
};

export default UserPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const res = await client.query({
    query: UserProfilePictureDocument,
    variables: { username: ctx.query.username }
  })


  return {
    props: {
      url: res.data.profileRel?.url ?? `https://avatars.dicebear.com/api/initials/${res.data.firstName}-${res.data.lastName ?? ""}.svg`
    },
  };
};
