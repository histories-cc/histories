import { Layout } from '@components/Layout';
import { LoadingButton } from '@components/LoadingButton';
import SubmitButton from '@components/LoadingButton/SubmitButton';
import { AccountCreatedCard, PostCard } from '@components/PostCard';
import {
  useFollowMutation,
  useUnfollowMutation,
} from '@graphql/relations.graphql';
import { useUpdateProfileMutation } from '@graphql/user.graphql';
import { useGetUserInfoQuery, useIsLoggedQuery } from '@graphql/user.graphql';
import GeneratedProfileUrl from '@lib/functions/GeneratedProfileUrl';
import { Button } from '@nextui-org/react';
import { Navbar } from 'components/Navbar';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { NextPageContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Router from 'next/router';
import React, { FC, useState } from 'react';
import { toast } from 'react-hot-toast';

const User: FC<{ username: string }> = ({ username }) => {
  const { data, loading, error, refetch } = useGetUserInfoQuery({
    variables: { username: username },
  });
  const logged = useIsLoggedQuery();

  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editProfileMutation] = useUpdateProfileMutation();

  if (error) {
    console.log(error);
    return <div>error...</div>;
  }
  if (loading) return <div>loading</div>;
  if (logged.loading) return <div>loading</div>;
  if (logged.error) {
    console.log(logged.error);
    return <div>error</div>;
  }
  if (data === null || data === undefined)
    return <div>user does not exist</div>;
  const isLogged = logged.data!.isLogged;

  return (
    <Layout title={`${data.user.username} | hiStories`}>
      <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
        <main className="flex m-auto max-w-screen-xl">
          <div className="w-full">
            <div className="relative m-auto rounded-full w-36 h-36">
              <Image
                src={GeneratedProfileUrl(
                  data.user.firstName,
                  data.user.lastName
                )}
                layout="fill"
                objectFit="contain"
                objectPosition="center"
                className="rounded-full"
                alt="Profile picture"
              />
            </div>

            <h2 className="py-4 text-2xl text-center">
              {`${data.user.firstName} ${data.user.lastName}`}
              {new Date().getTime() - data.user.createdAt < 129600000 && (
                <Button auto flat color="#ff4ecd">
                  New user
                </Button>
              )}
            </h2>
            {isLogged && logged.data?.isLogged!.id !== data.user.id && (
              <FollowButton data={data} refetch={refetch} />
            )}
            <div className="py-4 m-auto text-center text-md w-[60%]">
              {isLogged && logged.data?.isLogged!.id === data.user.id ? (
                <>
                  {!editMode ? (
                    <>
                      {data.user.bio}
                      <br />
                      <button
                        className="underline"
                        onClick={() => setEditMode(true)}
                      >
                        edit
                      </button>
                    </>
                  ) : (
                    <>
                      <Formik
                        initialValues={{
                          firstName: data.user.firstName,
                          lastName: data.user.lastName,
                          bio: data.user.bio,
                          username: data.user.username,
                          email: data.user.email,
                        }}
                        onSubmit={async (values) => {
                          setIsLoading(true);
                          try {
                            await editProfileMutation({
                              variables: values,
                            });
                            // if username has changed redirect to new page
                            if (values.username !== data.user.username)
                              Router.push(`/${values.username}`);
                            else await refetch();
                            setEditMode(false);
                          } catch (error) {
                            // @ts-ignore
                            toast.error(error.message);
                          }
                          setIsLoading(false);
                        }}
                      >
                        {() => (
                          <Form>
                            <div className="flex justify-between">
                              <Input
                                label="First name"
                                name="firstName"
                                type="text"
                                autoComplete="given-name"
                              />
                              <Input
                                label="Last name"
                                name="lastName"
                                type="text"
                                autoComplete="family-name"
                              />
                            </div>
                            <Input
                              label="Username"
                              name="username"
                              type="text"
                              autoComplete="username"
                            />
                            <Input
                              label="Bio"
                              name="bio"
                              type="text"
                              autoComplete="bio"
                            />
                            <Input
                              label="Email"
                              name="email"
                              type="email"
                              autoComplete="email"
                            />
                            {isLoading ? (
                              <Button loading loaderType="spinner" />
                            ) : (
                              <Button type="submit">Submit</Button>
                            )}
                          </Form>
                        )}
                      </Formik>
                      <button
                        className="underline"
                        onClick={() => setEditMode(false)}
                      >
                        leave edit
                      </button>
                    </>
                  )}
                </>
              ) : (
                data.user.bio
              )}
            </div>
            {data.user.posts &&
              data.user.posts.map((post: any) => (
                <PostCard key={post!.id} id={post!.id} isLoggedQuery={logged} />
              ))}
            <AccountCreatedCard
              date={data.user.createdAt}
              firstName={data.user.firstName}
            />
          </div>
        </main>
      </div>
    </Layout>
  );
};

export const getServerSideProps = async (
  context: NextPageContext
): Promise<{
  props: {
    username: string;
  };
}> => {
  return {
    props: {
      // @ts-ignore
      username: context.query.username.toString(),
    },
  };
};
const Input: FC<{
  type: string;
  name: string;
  autoComplete: string;
  label: string;
}> = ({ type, name, autoComplete, label }) => {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <Field
        type={type}
        className="w-full px-3 py-2 mb-3 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        name={name}
        autoComplete={autoComplete}
      />
      <ErrorMessage name={name} />
      <br />
    </div>
  );
};

const FollowButton = ({ data, refetch }: any) => {
  const [followMutation] = useFollowMutation();
  const [unfollowMutation] = useUnfollowMutation();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <SubmitButton
      text={data.user.isFollowing ? 'Unfollow' : 'Follow'}
      isLoading={isLoading}
      onClick={async () => {
        setIsLoading(true);
        try {
          if (data.user.isFollowing) {
            await unfollowMutation({
              variables: { userID: data.user.id },
            });
          } else {
            await followMutation({
              variables: { userID: data.user.id },
            });
          }
          await refetch();
        } catch (error) {
          // @ts-ignore
          toast.error(error.message);
        }
        setIsLoading(false);
      }}
    />
  );
};

export default User;
