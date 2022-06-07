import { Layout } from '@components/layouts';
import { usePersonalizedPostsQuery, usePostQuery } from '@graphql';
import UrlPrefix from '@src/constants/IPFSUrlPrefix';
import Image from 'next/image';
import React from 'react';

const Explore: React.FC = () => {
  const { data, loading, error } = usePersonalizedPostsQuery({
    variables: { skip: 0, take: 50 },
  });

  if (loading) return <div>post loading</div>;
  if (error) return <div>post error</div>;

  return (
    <Layout
      head={{
        title: `Explore | hiStories`,
        description: `Explore HiStories, place where you can share historical photos of places`,
        canonical: 'https://www.histories.cc/explore',
        openGraph: {
          title: `Explore | HiStories`,
          type: 'website',
          url: 'https://www.histories.cc/explore',
          description: `Explore HiStories`,
          site_name: 'Explore page',
        },
      }}
    >
      <div className="m-auto mt-4 grid grid-cols-3 gap-2 max-w-screen-xl">
        {data?.personalizedPosts.map((post, index) => (
          <PostCard key={post!.id} id={post!.id} index={index} />
        ))}
      </div>
    </Layout>
  );
};

const PostCard: React.FC<{ id: number; index: number }> = ({ id, index }) => {
  const { data, loading, error } = usePostQuery({ variables: { id } });

  if (loading) return <div>loading</div>;
  if (error) return <div>error</div>;

  return (
    <div
      className={`relative w-full  ${
        index === 1 ? 'col-span-2 row-span-2 h-[40rem]' : 'h-80'
      }`}
    >
      <Image
        src={UrlPrefix + data!.post.photos[0].hash}
        layout="fill"
        alt="image"
        objectFit="cover"
      />
    </div>
  );
};

export default Explore;
