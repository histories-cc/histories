import React from "react";
import Layout from "@components/layouts/User";
import UsersPostsTemplate from "@components/templates/UserPostsTemplate";
import { GetServerSidePropsContext } from "next";

interface IUserPageProps {
  username: string;
}

const UserPage: React.FC<IUserPageProps> = ({ username }) => {
  return <div>{username}.png</div>;
};

export default UserPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return {
    props: {
      username: ctx.query.username,
    },
  };
};
