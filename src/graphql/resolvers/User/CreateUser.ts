import { hash } from 'bcryptjs';

import RunCypherQuery from '../../../database/RunCypherQuery';
import SendEmail from '../../../email/SendEmail';

type CreateUserProps = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  emailSubscription: boolean;
};

const CreateUser = async ({
  username,
  firstName,
  lastName,
  email,
  password,
  emailSubscription,
}: CreateUserProps): Promise<void> => {
  // generate password hash
  const hashedPassword = await hash(
    password,
    parseInt(process.env.HASH_SALT || '10')
  );

  // authorization token for email verifiaction
  const authorizationToken = `${new Date().getTime()}`;

  const query = `
  CREATE (n:User {
    username : $username,
    firstName: $firstName,
    lastName: $lastName,
    email: $email,
    password: $hashedPassword,
    createdAt: $createdAt,
    verified: false,
    locale: $locale,
    authorizationToken: $authorizationToken, 
    newFollowerNotification: true,
    followingPlacePostNotification: true,
    followingUserPostNotification: true,
    newsletterNotification: true
  })
  `;

  await RunCypherQuery({
    query,
    params: {
      username,
      firstName,
      lastName,
      email,
      hashedPassword,
      authorizationToken,
      emailSubscription,
      createdAt: new Date(),
      locale: 'en',
    },
  });

  // send email for verification
  await SendEmail(
    'Verify email',
    EmailContent({ token: authorizationToken, firstName, lastName }),
    email
  );
};

type EmailProps = {
  token: string;
  firstName: string;
  lastName: string;
};

const EmailContent = ({ token, firstName, lastName }: EmailProps): string => {
  // email content
  return `
  <div>
    Hey ${firstName},
    <br>
    Please verify your email address by clicking  
    <a href="https://www.histories.cc/verify?token=${token}">here</a>.
    If it wasn't you, please ifnore this email lmao.
    Enjoy using histories xdd 😎 
  </div>`;
};

export default CreateUser;
