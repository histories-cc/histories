import { GetServerSidePropsContext } from 'next';
import { validate } from 'uuid';

import { SSRRedirect } from '..';

// get token from url query and validate it
// if invalid redirect to home
// else return token in props
async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const wholeToken = ctx.query.token; // get token from url query
  if (typeof wholeToken !== 'string') return SSRRedirect('/'); // validate token type

  // if token is older than three days, it's invalid
  const tokenCreatedAt = wholeToken.substring(0, wholeToken.indexOf('-')); // get first part of tokne == time when was created
  if (
    new Date().getTime() - parseFloat(tokenCreatedAt) >
    1000 * 60 * 60 * 24 * 3
  )
    return SSRRedirect('/'); // validate token type

  const token = wholeToken.substring(wholeToken.indexOf('-') + 1); // get everything except first part of token == uuid
  if (!validate(token)) return SSRRedirect('/'); // validate UUID

  return { props: { token: wholeToken } }; // return token in props
}

export default getServerSideProps;
