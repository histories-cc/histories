import { Layout } from '@components/Layouts';
import { Post } from '@components/Modules/Post';
import { usePersonalizedPostsQuery } from '@graphql/post.graphql';
import { useMeQuery } from '@graphql/user.graphql';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const Index: React.FC = () => {
  const logged = useMeQuery();

  if (logged.loading) return <div>logged loading</div>;
  if (logged.error) {
    console.log(logged.error);
    return <div>logged error</div>;
  }

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
        <div className="hidden w-[40%] xl:w-[30%] p-[1em] lg:block">
          <div className="sticky top-20">
            <div className="w-full mb-8 rounded-lg p-[1em] text-text-light"></div>
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
          variables: { skip: data!.personalizedPosts.length, take: 75 },
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
      hasMore={(data?.personalizedPosts.length ?? 1) % 10 === 0}
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
      {data?.personalizedPosts.map((post: any) => (
        <Post
          timeline
          {...post}
          key={post.id}
          refetch={refetch}
          photos={post.photos}
        />
      ))}
    </InfiniteScroll>
  );
};

export default Index;
