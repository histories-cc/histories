import { Input } from '@components/atoms';
import { Button } from '@components/atoms';
import AuthLayout from '@components/layouts/Auth';
import { useLoginMutation, useRegisterMutation } from '@graphql';
import { ILoginFormInput, IRegisterFormInput } from '../types/forms';
import Cookie from 'js-cookie';
import Link from 'next/link';
import Router from 'next/router';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { FiUser } from 'react-icons/fi';

const Login: React.FC = () => {
  // states
  const [loading, setLoading] = useState(false); // loading after submiting

  // hooks
  const { t } = useTranslation(); // translation
  const [registerMutation] = useRegisterMutation();
  const { register, handleSubmit } = useForm<IRegisterFormInput>();

  const onSubmit: SubmitHandler<IRegisterFormInput> = async (data) => {
    setLoading(true);
    try {
      const result = await registerMutation({
        variables: {
          input: data,
        },
      });
      if (result.data?.createUser !== 'error') {
        // login successful
        Cookie.set('session', result.data?.createUser as string, {
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
    <AuthLayout>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div className="flex items-center justify-center w-48 h-48 m-auto mb-6 rounded-full bg-marble text-subtle">
          <FiUser className="w-24 h-24 font-semibold" />
        </div>

        <div className="w-full">
          <div className="flex flex-col max-w-2xl m-auto">
            {/* USERNAME */}
            <Input
              label={t('username')}
              register={register}
              name="username"
              options={{ required: true }}
            />

            {/* EMAIL */}
            <Input
              label={t('emai')}
              register={register}
              name="email"
              type="email"
              options={{ required: true }}
            />

            <div className="flex gap-2 flex-col md:flex-row">
              {/* FIRST NAME */}
              <Input
                label={t('first_name')}
                register={register}
                name="firstName"
                options={{ required: true }}
              />

              {/* LAST NAME */}
              <Input
                label={t('last_name')}
                register={register}
                name="lastName"
                options={{ required: false }}
              />
            </div>

            {/* PASSWORD */}
            <Input
              label={t('password')}
              type="password"
              register={register}
              name="password"
              options={{ required: true, minLength: 8 }}
              autoComplete="password"
            />
          </div>
        </div>

        <div className="w-full">
          <div className="flex flex-col justify-center max-w-lg m-auto gap-2">
            <div className="flex items-center justify-center pb-4">
              {
                // <GoogleAuthButton />
              }
            </div>
            <Button disabled={loading}>{t('register')}</Button>
            <Link href="/login" passHref>
              <Button variant="secondary">{t('log in')}</Button>
            </Link>
            <Link href="/" passHref>
              <Button variant="secondary">
                {t('continue_without_account')}
              </Button>
            </Link>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
