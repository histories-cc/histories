import { ValidateVerificationToken } from '../validation';
import RunCypherQuery from '../database/RunCypherQuery';

const VerifyUser = async (token: string): Promise<string> => {
  // validate token input
  const validateToken = ValidateVerificationToken(token).error;
  if (validateToken !== null) throw new Error(validateToken);

  const query = `MATCH (user:User {authorizationToken: "${token}"}) 
  SET user.authorizationToken = NULL, user.verified = true`;

  await RunCypherQuery(query);

  return 'success';
};

export default VerifyUser;
