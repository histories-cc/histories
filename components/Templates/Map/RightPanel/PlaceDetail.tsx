import { Loading } from '@components/Elements';
import { usePostsQuery } from '@graphql/post.graphql';
import Image from 'next/image';
import Link from 'next/link';
import { SidebarPlaceType } from 'pages/map';
import React from 'react';
import UrlPrefix from 'shared/config/UrlPrefix';

const PlaceDetail: React.FC<{
  sidebarPlace: SidebarPlaceType;
}> = ({ sidebarPlace }) => {
  const { data, loading, error } = usePostsQuery({
    variables: {
      input: {
        filter: {
          placeId: sidebarPlace.id,
        },
      },
    },
  });

  return (
    <div className="w-full">
      <div className="text-center">
        <div className="relative w-full rounded-lg cursor-pointer h-52 md:h-72 bg-secondary">
          {sidebarPlace.preview && (
            <Image
              src={UrlPrefix + sidebarPlace.preview.hash}
              layout="fill"
              objectFit="cover"
              objectPosition="center"
              className="bg-gray-100 rounded-lg"
              alt="Profile picture"
            />
          )}

          <div className="absolute bottom-0 left-0 z-20 w-full h-full text-left rounded-lg bg-gradient-to-t from-[#000000ee] via-transparent to-transparent">
            <h1 className="absolute text-white bottom-3 left-3">
              {sidebarPlace.name ?? 'Place detail'}
            </h1>
          </div>
        </div>

        <p className="pt-4 text-left">{sidebarPlace.description}</p>

        {loading ? (
          <div className="flex justify-around w-full pt-24">
            <Loading color="#000000" size="xl" />
          </div>
        ) : error ? (
          <div>error</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.posts.map((post) => {
              return (
                <div
                  key={post.id}
                  className="flex flex-col w-full h-64 text-left bg-white border border-gray-200 rounded-lg hover:border-gray-400 hover:shadow-sm"
                >
                  {post.photos && (
                    <div className="relative w-full h-full rounded-t-lg cursor-pointer bg-secondary">
                      <Image
                        src={UrlPrefix + post.photos[0].hash}
                        layout="fill"
                        objectFit="cover"
                        objectPosition="center"
                        className="rounded-t-lg"
                        alt=""
                        quality={60}
                      />
                    </div>
                  )}
                  <div className="px-4 py-2">
                    <Link href={`/user/${post.author.username}`} passHref>
                      <h2 className="text-lg font-medium cursor-pointer">
                        {post.author.firstName} {post.author.lastName}
                      </h2>
                    </Link>
                    <h3 className="text-gray-600" style={{ fontSize: '12px' }}>
                      {post.description}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceDetail;
