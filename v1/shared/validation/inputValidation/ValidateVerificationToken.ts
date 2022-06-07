import { validate } from 'uuid';

const ValidateVerificationToken = (
  token: string
): {
  error: string | null;
} => {
  const regex = /^([0-9]{13,30})-([a-z0-9-]{1,}){0,240}$/i;

  if (token === undefined || token === null)
    return { error: 'invalid verification token' };

  if (regex.test(token) && validate(token.match(regex)![2]))
    return { error: null };
  else return { error: 'invalid verification token' };
};

export default ValidateVerificationToken;
