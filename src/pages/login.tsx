import { Input } from '@components/elements';
import Button from '@components/elements/buttons/Button';
import GoogleAuthButton from '@components/elements/buttons/GoogleAuth';
import AuthLayout from '@components/layouts/Auth';
import { useLoginMutation } from '@graphql';
import { RedirectLogged } from '@src/functions/ServerSideProps';
import LoginFormInputs from '@src/types/forms/loginFormInputs';
import Cookie from 'js-cookie';
import Link from 'next/link';
import Router from 'next/router';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { FiUser } from 'react-icons/fi';

const Login: React.FC = () => {
  const [login] = useLoginMutation(); // login mutation
  const [loading, setLoading] = useState(false); // loading after submiting
  const { t } = useTranslation(); // translation

  const { register, handleSubmit } = useForm<LoginFormInputs>();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setLoading(true);
    try {
      const result = await login({
        variables: {
          input: {
            username: data.login,
            password: data.password,
          },
        },
      });
      if (result.data?.login !== 'error') {
        // login successful
        Cookie.set('jwt', result.data?.login as string, {
          sameSite: 'strict',
        });
        Router.reload();
      }
    } catch (error: any) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <AuthLayout
      head={{
        title: `Log in | HiStories`,
        description: `Log in to your HiStories account`,
        canonical: 'https://www.histories.cc/login',
        openGraph: {
          title: `Log in | HiStories`,
          type: 'website',
          url: 'https://www.histories.cc/login',
          description: `Log in to your HiStories account`,
          site_name: 'Log in page',
        },
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div className="flex items-center justify-center w-48 h-48 m-auto mb-6 rounded-full bg-marble text-subtle">
          <FiUser className="w-24 h-24 font-semibold" />
        </div>
        <div className="w-full">
          <div className="flex flex-col max-w-2xl m-auto gap-4">
            <Input
              label={t('username_or_email')}
              register={register}
              name="login"
              options={{ required: true, minLength: 2, maxLength: 256 }}
              autoComplete="username"
            />
            <Input
              label={t('password')}
              type="password"
              register={register}
              name="password"
              options={{ required: true, minLength: 8 }}
              autoComplete="password"
            />
            <div className="flex justify-end">
              <Link href="/forgot-password">
                <a className="pl-2 underline">{t('forgot_password')}</a>
              </Link>
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="flex flex-col justify-center max-w-lg m-auto">
            <div className="flex items-center justify-center pb-4">
              <GoogleAuthButton />
            </div>
            <Button style="primary_solid" loading={loading}>
              {t('login').toUpperCase()}
            </Button>
            <Link href="/register" passHref>
              <Button style="transparent" loading={loading}>
                {t('register').toUpperCase()}
              </Button>
            </Link>
            <Link href="/" passHref>
              <Button style="transparent_secondary" loading={loading}>
                {t('continue_without_account').toUpperCase()}
              </Button>
            </Link>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
};

export const getServerSideProps = RedirectLogged;

export default Login;
