import { Input } from '@components/Elements';
import Button from '@components/Elements/Buttons/Button';
import AuthLayout from '@components/Layouts/Auth';
import { RedirectInvalidToken } from '@lib/functions/ServerSideProps';
// import { useChangePasswordMutation } from '@graphql/user.graphql';
import NewPasswordFormInputs from '@lib/types/forms/newPasswordFormInputs';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast'; 
import { useTranslation } from 'react-i18next';

const NewPassword: React.FC<{ token: string }> = ({ token }) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  // const [changePassword] = useChangePasswordMutation();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { },
  } = useForm<NewPasswordFormInputs>();

  const onSubmit: SubmitHandler<NewPasswordFormInputs> = async (data) => {
    setLoading(true);
    if (
      data.password != data.repeatPassword ||
      data.password.length < 8 ||
      data.repeatPassword.length < 8
    ) {
      toast.error('Unexpected error, try different password');
      setLoading(false);
      return;
    }

    try {
      /*await changePassword({
        variables: {
          


        },
      });
*/
      toast.success('Your password has been changed');

      router.replace('/login');
    } catch (error: any) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <AuthLayout
      head={{
        title: `New password | HiStories`,
        description: `New password`,
        canonical: 'https://www.histories.cc/auth/new-password',
        openGraph: {
          title: `New password | HiStories`,
          type: 'website',
          url: 'https://www.histories.cc/auth/new-password',
          description: `New password`,
          site_name: 'New password',
        },
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <Input
          label={t('New password')}
          register={register}
          name="password"
          options={{ required: true, minLength: 8 }}
          autoComplete="new-password"
          type="password"
        />
        <Input
          label={t('Repeat new password')}
          register={register}
          name="repeatPassword"
          options={{ required: true, minLength: 8 }}
          autoComplete="new-password"
          type="password"
        />
        <Button style="primary_solid" loading={loading}>
          {t(loading ? 'loading' : 'Save new password')}
        </Button>
      </form>
    </AuthLayout>
  );
};

export const getServerSideProps = RedirectInvalidToken

export default NewPassword;
