import React, { useState } from 'react';
import { useIsLoggedQuery } from '@graphql/user.graphql';
import router from 'next/router';
import Link from 'next/link';
import { useCreateUserMutation } from '@graphql/user.graphql';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import {
  ValidateEmail,
  ValidateName,
  ValidatePassword,
  ValidateUsername,
} from '@src/validation';
import { Layout } from '@components/Layout';
import SubmitButton from '@components/LoadingButton/SubmitButton';

const Register: React.FC = () => {
  const [createUser] = useCreateUserMutation();
  const { t } = useTranslation();
  const { data, loading, error } = useIsLoggedQuery();
  const [isLoading, setIsLoading] = useState(false);

  const formInputs = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    repeatPassword: '',
  };

  const [formValues, setFormValues] = useState(formInputs);
  const [errors, setErrors] = useState(formInputs);

  if (loading) return <div></div>;
  if (error) return <div></div>;
  if (data!.isLogged) router.replace('/');

  return (
    <Layout redirectLogged title={''}>
      <div className="max-w-[27rem] m-auto p-10">
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            setIsLoading(true);

            if (formValues.password !== formValues.repeatPassword) {
              toast.error('Passwords must match');
            } else {
              try {
                await createUser({
                  variables: formValues,
                });
                router.push('/login');
              } catch (error) {
                // @ts-ignore
                toast.error(error.message);
              }
            }
            setIsLoading(false);
          }}
        >
          <div className="flex gap-4">
            <FormInput
              placeholder="First name"
              autoComplete="given-name"
              helperText={errors.firstName && 'First name ' + errors.firstName}
              value={formValues.firstName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFormValues({ ...formValues, firstName: e.target.value });
                setErrors({
                  ...errors,
                  firstName: ValidateName(e.target.value).error ?? '',
                });
              }}
            />

            <FormInput
              placeholder="Last name"
              autoComplete="family-name"
              helperText={errors.lastName && 'Last name ' + errors.lastName}
              value={formValues.lastName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFormValues({ ...formValues, lastName: e.target.value });
                setErrors({
                  ...errors,
                  lastName: ValidateName(e.target.value).error ?? '',
                });
              }}
            />
          </div>
          <FormInput
            placeholder="Username"
            autoComplete="username"
            helperText={errors.username}
            value={formValues.username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setFormValues({ ...formValues, username: e.target.value });
              setErrors({
                ...errors,
                username: ValidateUsername(e.target.value).error ?? '',
              });
            }}
          />

          <FormInput
            placeholder="Email"
            type="email"
            autoComplete="email"
            helperText={errors.email}
            value={formValues.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setFormValues({ ...formValues, email: e.target.value });
              setErrors({
                ...errors,
                email: ValidateEmail(e.target.value).error ?? '',
              });
            }}
          />

          <FormInput
            placeholder="Password"
            type="password"
            autoComplete="new-password"
            helperText={errors.password}
            value={formValues.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setFormValues({ ...formValues, password: e.target.value });
              setErrors({
                ...errors,
                password: ValidatePassword(e.target.value).error ?? '',
              });
            }}
          />

          <FormInput
            placeholder="Repeat password"
            type="password"
            autoComplete="new-password"
            helperText={errors.repeatPassword}
            value={formValues.repeatPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setFormValues({ ...formValues, repeatPassword: e.target.value });
              setErrors({
                ...errors,
                repeatPassword:
                  ValidatePassword(e.target.value).error ??
                  formValues.password !== e.target.value
                    ? 'Passwords must match'
                    : '',
              });
            }}
          />

          <div className="mt-10 mb-2">
            <SubmitButton isLoading={isLoading} text="Sign up" />
          </div>
          <Link href="/login">
            <a className="underline pl-2">login to an existing account</a>
          </Link>
        </form>
      </div>
    </Layout>
  );
};

const FormInput = (props: any) => {
  return (
    <div className="w-full mb-6 h-12">
      <input
        {...props}
        className="shadow appearance-none border rounded-lg w-full h-10 px-3 mt-2 mb-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        required={true}
        type={props.type ?? 'text'}
      />
      <p className="text-red-500">{props.helperText}</p>
    </div>
  );
};

export default Register;
