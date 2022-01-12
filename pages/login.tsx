import { Input } from '@components/Elements';
import Button from '@components/Elements/Buttons/Button';
import GoogleAuthButton from '@components/Elements/Buttons/GoogleAuth';
import AuthLayout from '@components/Layouts/Auth';
import { useLoginMutation } from '@graphql/auth.graphql';
import { RedirectLogged } from '@lib/functions/ServerSideProps';
import LoginFormInputs from '@lib/types/forms/loginFormInputs';
import Cookie from 'js-cookie';
import Link from 'next/link';
import Router from 'next/router';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

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
        <Input
          label={t('username or email')}
          register={register}
          name="login"
          options={{ required: true }}
          autoComplete="username"
        />
        <Input
          label={t('password')}
          type="password"
          register={register}
          name="password"
          options={{ required: true }}
          autoComplete="password"
        />
        <Button style="primary_solid" loading={loading}>
          {t(loading ? 'loading' : 'login')}
        </Button>

        <GoogleAuthButton />
        <Link href="/register">
          <a className="pl-2 underline">{t('create new account')}</a>
        </Link>
        <Link href="/forgot-password">
          <a className="pl-2 underline">{t('forgot_password')}</a>
        </Link>
      </form>
    </AuthLayout>
  );
};

export const getServerSideProps = RedirectLogged;

export default Login;
