import { Layout } from './Components';

export type RegisteredWithGoogleEmailProps = {
  token: string;
  firstName: string;
};

const RegisteredWithGoogleEmail = ({
  token,
  firstName,
}: RegisteredWithGoogleEmailProps): string => {
  // email content
  return Layout(
    `
    <h1>Hey ${firstName} 👋</h1>
    <p style="text-align: justify">
      Thanks for your registration to Histories, platform for sharing historical photos of places
      and much more. Since you've signed up with Google, you can only sing in with Google.
       If you want to sign in also with username and password, you can create new password <a href="https://www.histories.cc/auth/new-password?token=${token}">here</a> 
    </p>
    `,
    'Verify email'
  );
};

export default RegisteredWithGoogleEmail;
