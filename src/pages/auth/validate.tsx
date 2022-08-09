import { GetServerSideProps } from "next"

export default () => { }

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    redirect: {
      permanent: true,
      destination: `/`
    },
  };

}
