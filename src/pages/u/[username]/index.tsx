import Layout from '@components/layouts/User';
import UsersPostsTemplate from '@components/templates/UserPostsTemplate';
import { GetServerSidePropsContext } from 'next';

interface IUserPageProps {
  username: string;
}

const UserPage: React.FC<IUserPageProps> = ({ username }) => {
  return (
    <Layout username={username}>
      <UsersPostsTemplate />
    </Layout>
  );
};

export default UserPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return {
    props: {
      username: ctx.query.username,
    },
  };
};
