import { GetServerSidePropsContext } from 'next';

import { GetCookieFromServerSideProps, IsJwtValid, SSRRedirect } from '..';

const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  const cookies = req.headers.cookie; // get cookies

  const jwt = GetCookieFromServerSideProps(cookies, 'jwt');

  // if JWT is null redirect
  if (jwt === null) return SSRRedirect('/login');
  // if there is JWT, verify it
  else return IsJwtValid(jwt) ? { props: {} } : SSRRedirect('/login');
};

export default getServerSideProps;
