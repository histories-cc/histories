import Button from '@components/elements/buttons/Button';
import GoogleAuthButton from '@components/elements/buttons/GoogleAuth';
import Input from '@components/elements/Input';
import AuthLayout from '@components/layouts/Auth';
import { useCreateUserMutation } from '@graphql/mutations/auth.graphql';
import { useUserExistsQuery } from '@graphql/queries/user.graphql';
import { RedirectLogged } from '@src/functions/ServerSideProps';
import Cookie from 'js-cookie';
import Link from 'next/link';
import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export interface RegisterFormInputs {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
  notifications: boolean;
}

const Register: React.FC = () => {
  const [createAccount] = useCreateUserMutation(); // create new user mutation
  const [loading, setLoading] = useState(false); // loading after submit
  const { t } = useTranslation(); // translation
  const {
    register,
    handleSubmit,
    formState: {},
    watch,
  } = useForm<RegisterFormInputs>();
  const userExistsQuery = useUserExistsQuery({
    variables: { input: { username: '' } },
  });
  const [usernameUsed, setUsernameUsed] = useState<boolean>(false);

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    if (data.password !== data.repeatPassword) {
      toast.error(t('passwords_not_match'));
      return;
    }

    setLoading(true);
    try {
      const result = await createAccount({
        variables: {
          input: {
            username: data.username,
            password: data.password,
            email: data.email,
            firstName: data.firstName,
            emailSubscription: data.notifications,
            lastName: data.lastName,
            locale: navigator.language,
          },
        },
      });
      if (result.data?.createUser !== 'error') {
        // register successful
        Cookie.set('jwt', result.data?.createUser as string, {
          sameSite: 'strict',
        });
        Router.reload();
      }
    } catch (error: any) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    setUsernameUsed(userExistsQuery.data?.user != null);
  }, [userExistsQuery]);

  useEffect(() => {
    const CheckUsername = async (username: string) => {
      try {
        await userExistsQuery.refetch({ input: { username } });
      } catch (error) {}
    };

    const username = watch('username');
    if (username.length == 0) setUsernameUsed(false);
    else CheckUsername(username);
  }, [watch('username')]);

  return (
    <AuthLayout
      heading={t('create_new_account')}
      head={{
        title: `Sign up | HiStories`,
        description: `Create new HiStories account`,
        canonical: 'https://www.histories.cc/register',
        openGraph: {
          title: `Sign up | HiStories`,
          type: 'website',
          url: 'https://www.histories.cc/register',
          description: `Create new HiStories account`,
          site_name: 'Sign up page',
        },
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            label={t('first_name')}
            register={register}
            name="firstName"
            options={{ required: true, maxLength: 256 }}
            autoComplete="given-name"
          />
          <Input
            label={t('last_name')}
            register={register}
            name="lastName"
            options={{ maxLength: 256 }}
            autoComplete="family-name"
          />
        </div>

        <Input
          label={t('username')}
          register={register}
          name="username"
          options={{ required: true, maxLength: 256 }}
          autoComplete="username"
        />
        {usernameUsed && t('username_already_used')}
        <Input
          label={t('email')}
          register={register}
          name="email"
          options={{ required: true }}
          autoComplete="email"
        />

        <Input
          label={t('password')}
          register={register}
          name="password"
          type="password"
          options={{ required: true, minLength: 8 }}
        />

        <Input
          label={t('repeat_password')}
          register={register}
          name="repeatPassword"
          type="password"
          options={{
            required: true,
            minLength: 8,
          }}
          autoComplete="new-password"
        />

        <label className="inline-flex items-center mt-3">
          <input
            type="checkbox"
            className="w-5 h-5 text-orange-600 rounded-lg form-checkbox"
            {...register('notifications')}
          />
          <span className="ml-2 text-gray-700">
            {t('send_email_notifications')}
          </span>
        </label>

        <Button style="primary_solid" loading={loading}>
          {t(loading ? 'loading' : 'register')}
        </Button>

        <GoogleAuthButton text={t('google_register')} />
        <Link href="/login">
          <a className="pl-2 underline">{t('log_in_to_existing_account')}</a>
        </Link>
        <Link href="/forgot-password">
          <a className="pl-2 underline">{t('forgot_password')}</a>
        </Link>
      </form>
    </AuthLayout>
  );
};

export const getServerSideProps = RedirectLogged;

export default Register;
