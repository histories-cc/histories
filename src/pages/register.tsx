import { Input } from '@components/elements';
import Button from '@components/elements/buttons/Button';
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
            <label className="label">username</label>
            <input
              {...register('username', { required: true })}
              className="text-input"
            />
            {/* EMAIL */}
            <label className="label">email</label>
            <input
              type="email"
              {...register('email', { required: true })}
              className="text-input"
            />
            {/* FIRST NAME */}
            <label className="label">first name</label>
            <input
              {...register('firstName', { required: true })}
              className="text-input"
            />
            {/* LAST NAME */}
            <label className="label">last name</label>
            <input
              {...register('lastName', { required: false })}
              className="text-input"
            />
            {/* PASSWORD */}
            <label className="label">password</label>
            <input
              type="password"
              {...register('password', { required: true })}
              className="text-input"
            />
          </div>
        </div>

        <div className="w-full">
          <div className="flex flex-col justify-center max-w-lg m-auto">
            <div className="flex items-center justify-center pb-4">
              {
                // <GoogleAuthButton />
              }
            </div>
            <Button style="primary_solid" loading={loading}>
              {t('register')}
            </Button>
            <Link href="/login" passHref>
              <Button style="transparent">{t('log in')}</Button>
            </Link>
            <Link href="/" passHref>
              <Button style="transparent_secondary">
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
