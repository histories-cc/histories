import Head from 'next/head';
import { NextPageContext } from 'next';
import React, { FC } from 'react';
import { useGetUserInfoQuery } from '../../src/graphql/getUserInfo.graphql';
import { Post } from '@components/MainPage';
import { IoLogoWordpress } from 'react-icons/io';
import { FaConnectdevelop } from 'react-icons/fa';
import Link from 'next/link';
import {
  useFollowMutation,
  useUnfollowMutation,
} from '../../src/graphql/user.graphql';
import { useIsLoggedQuery } from '../../src/graphql/user.graphql';
import { useRouter } from 'next/router';
import { number } from 'yup/lib/locale';

const User: FC<{ username: string }> = ({ username }) => {
  const { asPath } = useRouter();
  const [follow] = useFollowMutation();
  const [unfollow] = useUnfollowMutation();
  const { data, loading, error } = useGetUserInfoQuery({
    variables: { username: username },
  });
  const isLoggedQuery = useIsLoggedQuery();

  if (error) return <div>error</div>;
  if (loading) return <div>loading</div>;
  if (isLoggedQuery.loading) return <div>loading</div>;
  if (isLoggedQuery.error) return <div>error</div>;
  if (data?.getUserInfo === null) return <div>user does not exist</div>;

  const time = new Date(
    parseInt(data!.getUserInfo!.createdAt)
  ).toLocaleDateString('cs-cz');

  return (
    <>
      <Head>
        <title>hiStories</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="hiStories" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <body style={{ backgroundColor: '#18191A' }}>
        <nav>
          <ul className="bg-opacity-50 backdrop-filter backdrop-blur-md text-white bg-black w-full fixed top-0 z-20">
            <Link href="/">
              <li className="active py-1.5 px-4 ml-8 float-left">
                <a className="text-center display-block">
                  <IoLogoWordpress size={42} />{' '}
                  {/* hope that oonce here will be some normal logo xdd :(*/}
                </a>
              </li>
            </Link>
            <Link href="/">
              <li className="active py-4 px-4 float-left">
                <a className="text-center display-block">lorem ipsum</a>
              </li>
            </Link>
          </ul>
        </nav>
        <main className="w-full pt-20" style={{ backgroundColor: '#242526' }}>
          <div className="full">
            <div className="rounded-full bg-red-500 w-36 h-36 m-auto"></div>
            <h2 className="text-white text-center text-2xl py-4">
              {`${data!.getUserInfo!.firstName} ${data!.getUserInfo!.lastName}`}
            </h2>
            <p
              className="text-white text-center text-md py-4"
              style={{ borderBottom: '1px solid rgb(62,63,65)' }}
            >
              {data?.getUserInfo?.bio}
            </p>
            <div className="text-white h-16 px-80 pt-3">
              <a className="float-left mr-4 pt-2">Posts</a>
              <a className="float-left mr-4 pt-2">
                <Link href={`${asPath}/collections/`}>Collections</Link>
              </a>
              <a className="float-left mr-4 pt-2">
                Followers {data!.getUserInfo!.followers!.length}
              </a>
              <a className="float-left mr-4 pt-2">
                Following {data!.getUserInfo!.following!.length}
              </a>

              {(isLoggedQuery.data?.isLogged || isLoggedQuery.loading) && (
                <>
                  <button
                    className="float-right ml-4 rounded-lg bg-gray-500 p-2"
                    onClick={async () => {
                      try {
                        data?.getUserInfo?.isFollowing
                          ? await unfollow({
                              variables: { userID: data!.getUserInfo!.userID },
                            })
                          : await follow({
                              variables: { userID: data!.getUserInfo!.userID },
                            });
                      } catch (error) {
                        console.log(error.message);
                      }
                    }}
                  >
                    {data?.getUserInfo?.isFollowing ? 'Unfollow' : 'Follow'}
                  </button>
                  <a className="float-right ml-4 pt-2">Message</a>
                </>
              )}
            </div>
          </div>
          <div className="w-full pt-20" style={{ backgroundColor: '#18191A' }}>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-auto" style={{ position: 'sticky' }}>
                <div
                  className="w-full rounded-2xl text-white text-center ml-2 p-4"
                  style={{ backgroundColor: '#242526' }}
                >
                  {`${data!.getUserInfo!.firstName}'s collections`}
                  <div className="w-full grid gap-x-4 gap-y-4 grid-cols-3 pt-4">
                    <div className="bg-red-500 rounded-md h-24"></div>
                    <div className="bg-red-500 rounded-md h-24"></div>
                    <div className="bg-red-500 rounded-md h-24"></div>
                    <div className="bg-red-500 rounded-md h-24"></div>
                    <div className="bg-red-500 rounded-md h-24"></div>
                    <div className="bg-red-500 rounded-md h-24"></div>
                    <div className="bg-red-500 rounded-md h-24"></div>
                    <div className="bg-red-500 rounded-md h-24"></div>
                    <div className="bg-red-500 rounded-md h-24"></div>
                  </div>
                </div>
              </div>
              <div
                className="w-full col-auto"
                style={{ backgroundColor: '#18191A' }}
              >
                <Post
                  username="kewin"
                  url="https://images.unsplash.com/photo-1561457013-a8b23513739a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1124&q=80"
                />{' '}
                <Post
                  username="kewin"
                  url="https://images.unsplash.com/photo-1561457013-a8b23513739a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1124&q=80"
                />{' '}
                <Post
                  username="kewin"
                  url="https://images.unsplash.com/photo-1561457013-a8b23513739a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1124&q=80"
                />{' '}
                <Post
                  username="kewin"
                  url="https://images.unsplash.com/photo-1561457013-a8b23513739a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1124&q=80"
                />{' '}
                <Post
                  username="kewin"
                  url="https://images.unsplash.com/photo-1561457013-a8b23513739a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1124&q=80"
                />
                <div
                  className="w-full p-4 rounded-2xl text-white text-center"
                  style={{ backgroundColor: '#242526' }}
                >
                  <FaConnectdevelop size={64} className="m-auto" />
                  {data!.getUserInfo!.firstName} joined hiStories
                  <br />
                  on {time}
                </div>
                <div className="pb-20"></div>
              </div>
            </div>
          </div>
        </main>
      </body>
    </>
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

export default User;
