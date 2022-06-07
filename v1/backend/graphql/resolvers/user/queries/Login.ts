import { compareSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import validator from 'validator';

import { LoginInput } from '../../../../../src/graphql/index';
import { IsValidUsername } from '../../../../../shared/validation/InputValidation';
import { allowedErrors } from '../../../../constants/errors';
import RunCypherQuery from '../../../../database/RunCypherQuery';

const Login = async ({
  username: user,
  password,
}: LoginInput): Promise<any | null> => {
  try {
    const query = `
      MATCH (user:User) 
      // where case insensitive username or email matches 
      WHERE user.username =~ $name  
        XOR user.email =~ $name  // using XOR to avoid checking both username and email at the same time (which would potentially make a brute force attack faster)
      RETURN user{.*, id: ID(user)} as user
  `;

    // validate user input & password
    if (
      (!validator.isEmail(user) && !IsValidUsername(user)) ||
      password.length < 8
    )
      throw new Error('Wrong credentials');

    // run query
    const [userInfo] = await RunCypherQuery({
      query,
      params: {
        name: `(?i)${user}`, // (?i) = case insensitive
      },
    });

    // if user has been created with Google, and it doesn't have a password, he can't login
    if (userInfo.records[0].get('user').password == undefined)
      throw new Error('This account has not set a password yet');

    // check password
    if (!compareSync(password, userInfo.records[0].get('user').password))
      throw new Error('Wrong credentials');

    // if password matches
    return sign(
      // JWT payload
      {
        username: userInfo.records[0].get('user').username,
        id: userInfo.records[0].get('user').id,
      },
      process.env.JWT_SECRET!, // JWT secret
      {
        expiresIn: '360min', // JWT token expiration
      }
    );
  } catch (error: any) {
    // if query fails, user doesn't exist, then throw error
    throw new Error(
      allowedErrors.includes(error.message)
        ? error.message
        : 'Wrong credentials'
    );
  }
};

export default Login;
