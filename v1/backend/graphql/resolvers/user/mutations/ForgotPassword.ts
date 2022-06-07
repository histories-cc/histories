import RunCypherQuery from '../../../../database/RunCypherQuery';
import SendEmail from '../../../../email/SendEmail';
import { v4 as uuidv4 } from 'uuid';
import PasswordReset from '../../../../email/content/PasswordReset';

const ForgotPassword = async (login: string) => {
  const passwordResetToken = `${new Date().getTime()}-${uuidv4()}`; // generate token

  const query = `
    MATCH (user:User) 
    // where case insensitive username or email matches 
    WHERE user.username =~ $name  
       OR user.email =~ $name  
    SET user.passwordResetToken = $passwordResetToken   
    RETURN user{.*} as user
  `;

  const [user] = await RunCypherQuery({
    query,
    params: {
      name: `(?i)${login}`,
      passwordResetToken,
    },
  });

  // send email for verification
  await SendEmail(
    'Reset password',
    PasswordReset({
      token: passwordResetToken,
      firstName: user.records[0].get('user').firstName,
    }),
    user.records[0].get('user').email
  );

  return 'Email sent';
};

export default ForgotPassword;
