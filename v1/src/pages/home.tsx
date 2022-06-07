import Loading from '@components/elements/Loading';
import { Layout } from '@components/layouts';
import { Post } from '@components/modules/post';
import { useInterestingPlacesQuery } from '@graphql';
import { usePersonalizedPostsQuery } from '@graphql';
import { useMeQuery, useSuggestedUsersQuery } from '@graphql';
import UrlPrefix from '@src/constants/IPFSUrlPrefix';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Blurhash } from 'react-blurhash';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
const HomePage: React.FC = () => {
  const logged = useMeQuery();
  const interestingPlacesQuery = useInterestingPlacesQuery();
  const suggestedUsersQuery = useSuggestedUsersQuery();
  const { t } = useTranslation();

  const suggestedUsersPlaceholder = new Array(8).fill(null);

  if (logged.loading) return <div>loading</div>;
  if (logged.error) return <div>logged error</div>;

  return (
    <Layout
      head={{
        title: `HiStories`,
        description: `HiStories feed, posts from people and places you follow`,
        canonical: 'https://www.histories.cc/',
        openGraph: {
          title: `HiStories`,
          type: 'website',
          url: 'https://www.histories.cc/',
          description: `HiStories feed, posts from people and places you follow`,
          site_name: 'Main page',
        },
      }}
    >
      <div className="flex m-auto max-w-screen-xl">
        <div className="hidden w-[30%] p-[1em] xl:block">
          <div className="sticky top-20"></div>
        </div>
        <div className="w-full mt-2 xl:w-[40%] lg:w-[60%] xl:p-[1em]">
          <PersonalizedPosts />
        </div>
        {/* RIGHT COLUMN */}
        <div className="hidden w-[40%] xl:w-[30%] lg:block">
          <div className="sticky top-20">
            <div className="w-full pt-2">
              {/* SUGGESTED USERS */}
              <div className="pb-2 font-semibold">
                {t('people_you_may_know')}
              </div>
              <ul className="flex flex-col gap-2">
                {suggestedUsersQuery.loading
                  ? suggestedUsersPlaceholder.map((_, index) => (
                      <li className="flex items-center gap-2" key={index}>
                        <div className="relative w-10 h-10 bg-gray-300 rounded-full dark:bg-gray-200 animate-pulse" />
                        <div className="flex flex-col gap-2">
                          <div
                            style={{
                              width: `${Math.floor(
                                Math.random() * (160 - 70) + 1 + 70
                              )}px`,
                            }}
                            className="h-3 bg-gray-300 rounded-sm dark:bg-gray-200 animate-pulse"
                          />
                          <div
                            style={{
                              width: `${Math.floor(
                                Math.random() * (110 - 70) + 1 + 70
                              )}px`,
                            }}
                            className="h-3 bg-gray-300 rounded-sm dark:bg-gray-200 animate-pulse"
                          />
                        </div>
                      </li>
                    ))
                  : suggestedUsersQuery.data?.suggestedUsers
                      .slice(0, 8)
                      .map((user) =>
                        user == null ? null : (
                          <li className="flex items-center gap-2" key={user.id}>
                            <div className="relative w-10 h-10">
                              <Image
                                layout="fill"
                                objectFit="cover"
                                quality={60}
                                className="bg-gray-300 rounded-full dark:bg-gray-200"
                                src={
                                  user!.profile.startsWith('http')
                                    ? user!.profile
                                    : UrlPrefix + user!.profile
                                }
                                alt={t('profile_picture')}
                              />
                            </div>
                            <div>
                              <Link href={`/user/${user.username}`}>
                                <a className="block font-semibold text-gray-700 cursor-pointer">{`${
                                  user.firstName
                                } ${user?.lastName || ''}`}</a>
                              </Link>
                              <Link href={`/user/${user.username}`}>
                                <a className="text-gray-600 cursor-pointer">
                                  @{user.username}
                                </a>
                              </Link>
                            </div>
                          </li>
                        )
                      )}
                {suggestedUsersQuery.data?.suggestedUsers.length == 0 && (
                  <div className="text-center text-gray-600">
                    {t('no_suggested_users')}
                  </div>
                )}
              </ul>
              {/* INTERESTING PLACES */}
              <div className="pt-4 font-semibold">
                {t('interesting_places')}
              </div>
              <div className="mt-4 grid grid-cols-3 h-52 gap-2">
                {interestingPlacesQuery.loading ? (
                  <>
                    {[null, null, null].map((_, i) => (
                      <div
                        key={i}
                        className="relative flex items-center justify-center text-gray-600 bg-gray-300 rounded-lg animate-pulse"
                      >
                        <Loading size="lg" />
                      </div>
                    ))}
                  </>
                ) : (
                  interestingPlacesQuery.data?.places
                    .filter((place) => place?.preview?.hash != undefined)
                    .slice(0, 3)
                    .map((place) => (
                      <Link
                        href={`/?lat=${place.latitude}&lng=${place.longitude}&zoom=11&place=${place.id}`}
                        key={place.id}
                        passHref
                      >
                        <abbr
                          title={place.name || ''}
                          className="relative bg-gray-300 rounded-lg cursor-pointer"
                        >
                          <Blurhash
                            className="blurhash"
                            hash={place.preview!.blurhash}
                            width="100%"
                            height="100%"
                            punch={1}
                          />
                          <Image
                            className="w-full h-full rounded-lg"
                            src={UrlPrefix + place.preview!.hash}
                            layout="fill"
                            objectFit="cover"
                            quality={60}
                            alt={place.name || t('place detail')}
                          />
                        </abbr>
                      </Link>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const PersonalizedPosts = () => {
  const { data, loading, error, refetch, fetchMore } =
    usePersonalizedPostsQuery({
      variables: { skip: 0, take: 20 }, // minimize number of things needed to load at start
    });

  if (loading) return <div>post loading</div>;
  if (error) return <div>{JSON.stringify(error)}</div>;

  return (
    <InfiniteScroll
      dataLength={data!.personalizedPosts.length} //This is important field to render the next data
      next={() => {
        fetchMore({
          variables: { skip: data!.personalizedPosts.length, take: 20 },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            return {
              ...previousResult,
              personalizedPosts: [
                ...previousResult.personalizedPosts,
                ...(fetchMoreResult?.personalizedPosts ?? []),
              ],
            };
          },
        });
      }}
      hasMore={(data?.personalizedPosts.length ?? 1) % 20 === 0}
      loader={
        <p style={{ textAlign: 'center' }}>
          <b>loading</b>
        </p>
      }
      endMessage={
        <p style={{ textAlign: 'center' }}>
          <b>Yay! You have seen it all</b>
        </p>
      }
      refreshFunction={async () => {
        await refetch();
      }}
    >
      {data?.personalizedPosts.map(
        (post) => post && <Post timeline {...post} key={post.id} />
      )}
    </InfiniteScroll>
  );
};

export default HomePage;
