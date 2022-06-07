import { GetServerSidePropsContext } from 'next';

import { GetCookieFromServerSideProps, IsJwtValid, SSRRedirect } from '..';

const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  const cookies = req.headers.cookie; // get cookies

  const jwt = GetCookieFromServerSideProps(cookies, 'jwt');

  // if JWT is null
  if (jwt === null) return { props: {} };
  // if JWT is valid redirect to home
  else return IsJwtValid(jwt) ? SSRRedirect('/') : { props: {} };
};

export default getServerSideProps;
