import { Input } from '@components/Elements';
import Button from '@components/Elements/Buttons/Button';
import AuthLayout from '@components/Layouts/Auth';
import { useForgotPasswordMutation } from '@graphql/auth.graphql';
import { RedirectLogged } from '@lib/functions/ServerSideProps';
import ForgotPasswordFormInputs from '@lib/types/forms/forgotPasswordFormInputs';
import Link from 'next/link';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const ForgotPassword: React.FC = () => {
  const [forgotPasswordMutation] = useForgotPasswordMutation(); // forgot password mutation (creates token and sends email)
  const [loading, setLoading] = useState(false); // loading after submit
  const { t } = useTranslation(); // translation

  const {
    register,
    handleSubmit,
    formState: {},
  } = useForm<ForgotPasswordFormInputs>();

  const onSubmit: SubmitHandler<ForgotPasswordFormInputs> = async (data) => {
    setLoading(true);
    try {
      await forgotPasswordMutation({
        variables: {
          login: data.login,
        },
      });
      toast.success('Password reset was sent to your email');
    } catch (error: any) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <AuthLayout
      head={{
        title: `Forgot password | HiStories`,
        description: `Forgot password`,
        canonical: 'https://www.histories.cc/forgot-password',
        openGraph: {
          title: `Forgot password | HiStories`,
          type: 'website',
          url: 'https://www.histories.cc/forgot-password',
          description: `Forgot password`,
          site_name: 'Forgot password',
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
        <Button style="primary_solid" loading={loading}>
          {t(loading ? 'loading' : 'Send Password Reset Link')}
        </Button>

        <Link href="/register">
          <a className="pl-2 underline">{t('create new account')}</a>
        </Link>
        <Link href="/login">
          <a className="pl-2 underline">{t('log in')}</a>
        </Link>
      </form>
    </AuthLayout>
  );
};

export const getServerSideProps = RedirectLogged;

export default ForgotPassword;
