import { useGoogleAuthMutation } from '@graphql';
import Cookie from 'js-cookie';
import router from 'next/router';
import React from 'react';
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const GoogleAuthButton: React.FC = () => {
  const [googleAuth] = useGoogleAuthMutation();

  async function OnSubmit(
    response: GoogleLoginResponse | GoogleLoginResponseOffline
  ) {
    if ('tokenId' in response)
      try {
        const result = await googleAuth({
          variables: {
            googleJWT: response.tokenId,
          },
        });
        if (result.data?.googleAuth !== 'error') {
          Cookie.set('jwt', result.data?.googleAuth as string, {
            sameSite: 'strict',
          });
          router.reload();
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    else toast.error('Google login failed');
  }
  return (
    // show login with google only if google client id is set
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? (
      <GoogleLogin
        clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
        render={(renderProps) => <WithGoogle renderProps={renderProps} />}
        buttonText=""
        onSuccess={OnSubmit}
        onFailure={() => toast.error('Google registration failed')}
        cookiePolicy={'single_host_origin'}
      />
    ) : null
  );
};

const WithGoogle: React.FC<{
  renderProps: {
    onClick: () => void;
    disabled?: boolean | undefined;
  };
}> = ({ renderProps }) => {
  const { t } = useTranslation();

  return (
    <button
      onClick={renderProps.onClick}
      disabled={renderProps.disabled}
      type="button"
      className="flex items-center font-semibold text-black gap-2 dark:text-white"
    >
      <svg
        width="49"
        height="48"
        viewBox="0 0 49 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.5 24C0.5 10.7452 11.2452 0 24.5 0C37.7548 0 48.5 10.7452 48.5 24C48.5 37.2548 37.7548 48 24.5 48C11.2452 48 0.5 37.2548 0.5 24ZM24.4654 17.6213C26.4154 17.6213 27.7309 18.4649 28.4809 19.1698L31.4118 16.304C29.6117 14.6284 27.2693 13.6 24.4654 13.6C20.4037 13.6 16.8959 15.9342 15.1881 19.3316C14.4842 20.7413 14.0804 22.3244 14.0804 24C14.0804 25.6756 14.4842 27.2587 15.1881 28.6684L18.5575 26.0569L15.1996 28.6684C16.9074 32.0658 20.4037 34.4 24.4654 34.4C27.2693 34.4 29.6232 33.4756 31.3425 31.8809C33.3041 30.0667 34.435 27.3973 34.435 24.2311C34.435 23.376 34.3657 22.752 34.2157 22.1049H24.4654V25.9644H30.1887C30.0733 26.9236 29.4502 28.368 28.0655 29.3387C27.1885 29.9511 26.0116 30.3787 24.4654 30.3787C21.7191 30.3787 19.3883 28.5644 18.5575 26.0569C18.3382 25.4098 18.2113 24.7164 18.2113 24C18.2113 23.2836 18.3382 22.5902 18.5459 21.9431C19.3883 19.4356 21.7191 17.6213 24.4654 17.6213Z"
          fill="#FF4F00"
        />
      </svg>
      {t('login_with_google')}
    </button>
  );
};

export default GoogleAuthButton;
