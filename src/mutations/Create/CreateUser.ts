import { hash } from 'bcryptjs';
import { uuid } from 'uuidv4';
import SendEmail from '../../email/SendEmail';
import RunCypherQuery from '../../database/RunCypherQuery';

// QUERY
/*
 * create user node with props
 */

type CreateUserProps = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

const CreateUser = async ({
  username,
  firstName,
  lastName,
  email,
  password,
}: CreateUserProps): Promise<void> => {
  // generate password hash
  const hashedPassword = await hash(
    password,
    parseInt(process.env.HASH_SALT || '10')
  );

  // authorization token for email verifiaction
  const authorizationToken = `${new Date().getTime()}-${uuid()}`;

  const query = `CREATE (n:User {
username : "${username}",
firstName: "${firstName}",
lastName: "${lastName}",
email: "${email}",
password: "${hashedPassword}",
createdAt: ${new Date().getTime()},
verified: false,
authorizationToken: "${authorizationToken}"
})`;

  await RunCypherQuery(query);

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
