import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { Button, Input } from '@components/elements';
import SettingsLayout from '@components/layouts/Settings';
import { useUpdateProfileMutation } from '@graphql';
import { MeDocument, MeQuery } from '@graphql';
import {
  GetCookieFromServerSideProps,
  IsJwtValid,
  SSRRedirect,
} from '@src/functions';
import { GetServerSidePropsContext } from 'next';
import Router from 'next/router';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

type EditProfileInput = {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
};

const Account: React.FC<{
  me: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
  };
}> = ({ me }) => {
  const { t } = useTranslation();
  const [updateProfileMutation] = useUpdateProfileMutation();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: {},
  } = useForm<EditProfileInput>({
    defaultValues: me,
  });

  const onSubmit: SubmitHandler<EditProfileInput> = async (data) => {
    setLoading(true);
    try {
      const result = await updateProfileMutation({
        variables: {
          input: {
            firstName: data.firstName,
            lastName: data.lastName,
            username: data.username,
            email: data.email,
          },
        },
      });
      if (result.data?.updateProfile !== 'error') {
        toast.success(t('profile updated'));
        Router.reload();
      }
    } catch (error: any) {
      toast.error(error.message);
    }
    setLoading(false);
  };
  return (
    <SettingsLayout
      current="account"
      heading="account"
      headingDescription=""
      head={{
        title: `${t('Account settings')} | hiStories`,
        description: `Account settings`,
        canonical: 'https://www.histories.cc/settings',
        openGraph: {
          title: `Account settings | hiStories`,
          type: 'website',
          url: 'https://www.histories.cc/settings',
          description: `Account settings`,
          site_name: 'Settings page',
        },
      }}
    >
      <h3 className="text-2xl font-medium">{t('profile')}</h3>
      <p className="pb-4 text-base text-gray-500">
        {t('profile_update_description')}
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="pb-8 grid grid-cols-1 w-80 gap-2">
          <Input
            label={t('first_name')}
            register={register}
            name="firstName"
            options={{ required: true, minLength: 3, maxLength: 50 }}
            placeholder={me.firstName}
            autoComplete="given-name"
          />
          <Input
            label={t('last_name')}
            register={register}
            name="lastName"
            options={{ required: true, minLength: 3, maxLength: 50 }}
            placeholder={me.lastName}
            autoComplete="family-name"
          />
          <Input
            label={t('email')}
            register={register}
            name="email"
            type="email"
            options={{ required: true, minLength: 3, maxLength: 50 }}
            placeholder={me.email}
            autoComplete="email"
          />
          <Input
            label={t('username')}
            register={register}
            name="username"
            options={{ required: true, minLength: 3, maxLength: 50 }}
            placeholder={me.username}
            autoComplete="username"
          />
          <div className="mt-2 mb-2">
            <Button loading={loading}>{t('update_profile')}</Button>
          </div>
        </div>
      </form>
      <h3 className="text-2xl font-medium">{t('delete_account')}</h3>
      <p className="pb-4 text-base text-gray-500">
        {t('delete_account_description')}
      </p>
      <button className="block px-4 py-1 font-medium text-red-600 bg-red-200 border border-red-200 rounded-md">
        {t('delete_account')}
      </button>
    </SettingsLayout>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  const cookies = req.headers.cookie; // get cookies

  const jwt = GetCookieFromServerSideProps(cookies, 'jwt');

  // if JWT is null redirect
  if (jwt === null) return SSRRedirect('/login');
  // if there is JWT, verify it
  if (!IsJwtValid(jwt)) return SSRRedirect('/login');

  // create new apollo graphql client
  const client = new ApolloClient({
    link: createHttpLink({
      uri:
        process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ??
        'http://localhost:3000/api/graphql',
      headers: {
        authorization: jwt ? `Bearer ${jwt}` : '',
      },
    }),

    cache: new InMemoryCache(),
  });

  // fetch user query
  if (!req.url?.startsWith('_next')) {
    try {
      const { data: meQuery }: { data: MeQuery } = await client.query({
        query: MeDocument,
        variables: { username: ctx.query.username },
      });

      // return props
      return {
        props: {
          me: meQuery.me,
        },
      };
    } catch (e) {
      return SSRRedirect('/404?error=user_does_not_exist');
    }
  }
  // this should not be needed 🤷‍♀️
  return {
    props: {},
  };
};

export default Account;
