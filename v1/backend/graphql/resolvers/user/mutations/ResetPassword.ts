import RunCypherQuery from '../../../../database/RunCypherQuery';
import { hash } from 'bcrypt';
import { validate } from 'uuid';

const ResetPassword = async (wholeToken: string, newPassword: string) => {
  // if token is older than three days, it's invalid
  const tokenCreatedAt = wholeToken.substring(0, wholeToken.indexOf('-')); // get first part of tokne == time when was created
  if (
    new Date().getTime() - parseFloat(tokenCreatedAt) >
    1000 * 60 * 60 * 24 * 3
  )
    throw new Error('Token expired');

  const token = wholeToken.substring(wholeToken.indexOf('-') + 1); // get everything except first part of token == uuid
  if (!validate(token)) throw new Error('Invalid token');

  // generate password hash
  const hashedPassword = await hash(
    newPassword,
    parseInt(process.env.HASH_SALT || '10')
  );

  // cypher query
  const query = `
    MATCH (user:User {passwordResetToken: $token})  // match user with same token
    SET user.password = $newPassword,               // update password
        user.passwordResetToken = null              // delete user's token
    RETURN user{.*} as user                         // return user
  `;

  // run query
  const [result] = await RunCypherQuery({
    query,
    params: {
      token: wholeToken,
      newPassword: hashedPassword,
    },
  });

  // if there is no user with this passwordResetToken
  if (result.records[0] === undefined) throw new Error('Invalid token');
  else return 'Password changed successfully';
};

export default ResetPassword;
