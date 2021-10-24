import DbConnector from '../database/driver';
import { hash } from 'bcryptjs';
import { uuid } from 'uuidv4';
import SendEmail from '../email/SendEmail';

const CreateUser = async (input: {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<string> => {
  const { username, firstName, lastName, email, password } = input;

  const hashedPassword = await hash(
    password,
    parseInt(process.env.HASH_SALT || '10')
  );

  const authorizationToken = `${new Date().getTime()}-${uuid()}`;

  const query = `CREATE
    (n:User {
      username : "${username}",
      firstName: "${firstName}",
      lastName: "${lastName}",
      email: "${email}",
      password: "${hashedPassword}",
      createdAt: ${new Date().getTime()},
      verified: false,
      authorizationToken: "${authorizationToken}"
    })`;

  const driver = DbConnector();
  const session = driver.session();

  await session.run(query);
  driver.close();

  const emailHtml = `<a href="https://www.histories.cc/verify?token=${authorizationToken}">click here</a>`;
  await SendEmail('Verify email', emailHtml, email);

  return 'success';
};

export default CreateUser;