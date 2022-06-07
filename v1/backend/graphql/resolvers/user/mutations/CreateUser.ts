import { hash } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';

import { CreateUserInput } from '../../../../../src/graphql/index';
import {
  IsValidName,
  IsValidUsername,
} from '../../../../../shared/validation/InputValidation';
import RunCypherQuery from '../../../../database/RunCypherQuery';
import VerificationEmail from '../../../../email/content/EmailVerification';
import SendEmail from '../../../../email/SendEmail';
import SignJWT from '../../../../functions/SignJWT';

const CreateUser = async ({
  username,
  firstName,
  lastName,
  email,
  password,
  emailSubscription,
  locale,
}: CreateUserInput) => {
  if (!validator.isEmail(email)) throw new Error('Invalid email');

  if (!IsValidUsername(username)) throw new Error('Invalid username');

  if (!IsValidName(firstName)) throw new Error('Invalid first name');
  if (lastName != null && !IsValidName(lastName))
    throw new Error('Invalid last name');

  if (password.length < 8) throw new Error('Invalid password');

  // generate password hash
  const hashedPassword = await hash(
    password,
    parseInt(process.env.HASH_SALT || '10')
  );

  // authorization token for email verifiaction
  const authorizationToken = uuidv4();

  const query = `
  CREATE (user:User {
    username : $username,
    firstName: $firstName,
    lastName: $lastName,
    
    email: $email,
    password: $hashedPassword,
    createdAt: $createdAt,

    verified: false,
    authorizationToken: $authorizationToken,  // token used to verify email address
    
    profile: $profile,
    profileBlurhash: "",
    
    locale: $locale,
    isAdmin: false,
    
    newFollowerNotification: $notifications,
    followingPlacePostNotification: $notifications,
    followingUserPostNotification: $notifications,
    newsletterNotification: $notifications
  })
  SET user.id = ID(user)
  RETURN user.id AS id
  `;

  const profile = `https://avatars.dicebear.com/api/initials/${encodeURIComponent(
    firstName
  )}%20${lastName ? encodeURIComponent(lastName) : ''}.svg`;

  const [user] = await RunCypherQuery({
    query,
    params: {
      username,
      firstName,
      lastName: lastName ?? null,
      email,
      hashedPassword,
      authorizationToken,
      createdAt: new Date().getTime(),
      profile: profile,
      locale: locale ?? 'en',
      notifications: emailSubscription,
    },
  });

  // send email for verification
  await SendEmail(
    'Verify email',
    VerificationEmail({ token: authorizationToken, firstName }),
    email
  );

  if (!process.env.JWT_SECRET) throw new Error('JWT secret is not defined');

  return SignJWT(user.records[0].get('id'), process.env.JWT_SECRET);
};

export default CreateUser;
