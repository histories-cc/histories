import { hash } from 'bcryptjs';

import { CreateUserInput } from '../../../../../.cache/__types__';
import RunCypherQuery from '../../../../database/RunCypherQuery';
import VerificationEmail from '../../../../email/content/EmailVerification';
import SendEmail from '../../../../email/SendEmail';
import SignJWT from '../../../../functions/SignJWT';
import { v4 as uuidv4 } from 'uuid';

const CreateUser = async ({
  username,
  firstName,
  lastName,
  email,
  password,
  emailSubscription,
  locale,
}: CreateUserInput) => {
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
  )}%20${encodeURIComponent(lastName)}.svg`;

  const [user] = await RunCypherQuery({
    query,
    params: {
      username,
      firstName,
      lastName,
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
