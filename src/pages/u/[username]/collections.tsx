import Layout from '@components/layouts/User'; 
import UsersCollectionsTemplate from '@components/templates/UserCollectionsTemplate';
import { GetServerSidePropsContext } from 'next';

interface IUserPageProps {
  username: string;
}

const UserPage: React.FC<IUserPageProps> = ({ username }) => {
  return (
    <Layout username={username}>
      <UsersCollectionsTemplate />
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
