import { orange_main } from '../../../shared/constants/colors';
import { Layout } from './Components';

export type VerificationEmail = {
  token: string;
  firstName: string;
};

const VerificationEmail = ({ token, firstName }: VerificationEmail): string => {
  // email content
  return Layout(
    `
    <h1>Hey ${firstName} 👋</h1>
    <p style="text-align: justify">
      Welcome to Histories, platform for sharing historical photos of places
      and much more. Before we start, we need to confirm your email address.
    </p>
    <div style="display: flex; align-items: center; padding-bottom: 40px">
      <a
        href="https://www.histories.cc/verify?token=${token}"
        style="
          background-color: ${orange_main};
          color: white;
          border: 0;
          border-radius: 8px;
          padding: 8px 30px;
          font-size: 14px;
          font-weight: bold;
          text-decoration: none;
          margin: auto;
        "
      >
        Confirm
      </a>
    </div>
    <p>
      If this wasn’t you, ignore this email and don’t click confirm.
    </p>
    `,
    'Verify email'
  );
};

export default VerificationEmail;
