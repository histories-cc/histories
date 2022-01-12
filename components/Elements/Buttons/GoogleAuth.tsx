import { useGoogleAuthMutation } from '@graphql/auth.graphql';
import Cookie from 'js-cookie';
import Image from 'next/image';
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
      type="submit"
      className="flex items-center justify-center px-4 mt-6 font-medium text-black bg-white border border-gray-800 gap-1 py-1.5 rounded-md"
    >
      <Image
        src="/assets/google.svg"
        height={18}
        width={18}
        alt="google logo"
        quality={60}
      />

      <a>{t('register')}</a>
    </button>
  );
};

export default GoogleAuthButton;
