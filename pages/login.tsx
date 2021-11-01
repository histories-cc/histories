import React, { FC, useState } from 'react';
import { useLoginMutation } from '@graphql/user.graphql';
import Link from 'next/link';
import Router from 'next/router';
import { useTranslation } from 'react-i18next';
import Cookie from 'js-cookie';
import { toast } from 'react-hot-toast';
import { Layout } from '@components/Layout';
import SubmitButton from '@components/LoadingButton/SubmitButton';

const Login: FC = () => {
  const [login] = useLoginMutation();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const formInputs = {
    username: '',
    password: '',
  };

  const [formValues, setFormValues] = useState(formInputs);

  return (
    <Layout redirectLogged title={''}>
      <div className="max-w-[27rem] m-auto p-10">
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            setIsLoading(true);
            try {
              const result = await login({
                variables: formValues,
              });
              if (result.data?.login !== 'error') {
                // login successful
                Cookie.set('jwt', result.data?.login as string, {
                  sameSite: 'strict',
                });
                Router.reload();
              }
            } catch (error) {
              // @ts-ignore
              toast.error(error.message);
            }
            setIsLoading(false);
          }}
        >
          <FormInput
            placeholder="username or email"
            type="text"
            value={formValues.username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setFormValues({ ...formValues, username: e.target.value });
            }}
          />

          <FormInput
            placeholder="password"
            type="password"
            value={formValues.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setFormValues({ ...formValues, password: e.target.value });
            }}
          />

          <div className="pt-2 mb-2">
            <SubmitButton isLoading={isLoading} text="Sign up" />
          </div>
          <Link href="/register">
            <a className="underline pl-2">create new account</a>
          </Link>
        </form>
      </div>
    </Layout>
  );
};

const FormInput = (props: any) => {
  return (
    <div className="w-full mb-2">
      <input
        {...props}
        className="shadow appearance-none border rounded-lg w-full h-10 px-3 mt-2 mb-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        required={true}
        type={props.type ?? 'text'}
      />
    </div>
  );
};

export default Login;
