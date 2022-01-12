import { Layout } from '@components/Layouts';
import { Minimap } from '@components/Modules/Minimap';
import { usePostQuery } from '@graphql/post.graphql';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import UrlPrefix from 'shared/config/UrlPrefix';

const PostDetail: React.FC<{ id: number }> = ({ id }) => {
  const { data, loading, error } = usePostQuery({ variables: { id } });

  if (loading) return <div>loading</div>;
  if (data?.post === undefined) return <div>post is undefined</div>;
  if (error) return <div>error</div>;

  return (
    <Layout
      head={{
        title: `${data.post.author.firstName}'s post | HiStories`,
        description:
          data.post.description ?? `${data.post.author.firstName}'s post`,
        canonical: `https://www.histories.cc/post/${data.post.id}`,
        openGraph: {
          title: `${data.post.author.firstName}'s post | HiStories`,
          description:
            data.post.description ?? `${data.post.author.firstName}'s post`,
          type: 'website',
          url: `https://www.histories.cc/post/${data.post.id}`,
          images: data.post.photos.map((photo) => ({
            url: UrlPrefix + photo.hash,
            alt: `${data.post.author.firstName}'s photo`,
            type: 'image/jpeg',
            height: photo.height,
            width: photo.width,
          })),
          site_name: 'Post',
        },
      }}
    >
      <main className="max-w-4xl m-auto">
        {data.post.photos.length > 0 && (
          <div className="flex flex-col mt-8 md:flex-row">
            <div className="relative w-full bg-white cursor-pointer dark:bg-black h-[60vh] bg-secondary">
              <Image
                src={UrlPrefix + data.post.photos[0].hash}
                layout="fill"
                objectFit="contain"
                objectPosition="center"
                alt="Profile picture"
              />
            </div>
            <div className="flex flex-col w-full px-4 md:w-[60%] gap-4 md:p-0">
              {/* PROFILE INFO */}
              <div className="flex items-center px-4 gap-2">
                <Link href={`/user/${data.post.author.username}`} passHref>
                  <div className="relative w-10 h-10 rounded-full cursor-pointer bg-secondary">
                    <Image
                      src={
                        data.post.author.profile.startsWith('http')
                          ? data.post.author.profile
                          : UrlPrefix + data.post.author.profile
                      }
                      layout="fill"
                      objectFit="fill"
                      objectPosition="center"
                      className="rounded-full"
                      alt="Profile picture"
                    />
                  </div>
                </Link>
                <Link href={`/user/${data.post.author.username}`}>
                  <a className="font-medium">
                    {`${data.post.author.firstName} ${data.post.author.lastName}`}
                  </a>
                </Link>
              </div>

              {/* DESCRIPTION */}
              <div className="w-full">{data.post.description}</div>

              {/* MINIMAP */}
              <div className="w-full h-[40vh]">
                <Minimap
                  coordinates={[
                    data.post.place.latitude,
                    data.post.place.longitude,
                  ]}
                />
              </div>
            </div>
          </div>
        )}

        {/* COMMENTS */}
      </main>
    </Layout>
  );
};

export default PostDetail;
