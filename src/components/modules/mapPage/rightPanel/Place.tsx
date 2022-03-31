import EditPlaceModal from '@components/modules/modals/EditPlaceModal';
import { useMapSidebarPlaceQuery } from '@graphql/queries/place.graphql';
import { useMapSidebarPostsQuery } from '@graphql/queries/post.graphql';
import UrlPrefix from '@src/constants/IPFSUrlPrefix';
import { MapContext } from '@src/contexts/MapContext';
import MeContext from '@src/contexts/MeContext';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  HiOutlineChevronLeft,
  HiOutlineLocationMarker,
  HiOutlinePlusCircle,
  HiOutlineShare,
  HiPencil,
  HiPlus,
} from 'react-icons/hi';
import TimeAgo from 'react-timeago';

interface PlaceProps {
  id: number;
}

const PlacePost: React.FC<{ post: any }> = ({ post }) => {
  const { t } = useTranslation();

  return (
    <Link // this will eventually open the modal with the photo
      href={`/post/${post.id}`}
      key={post.id}
      passHref
    >
      <div className="flex flex-col w-full h-64 text-left text-black rounded-lg bg-zinc-200 dark:bg-zinc-800/80 hover:bg-zinc-300 dark:hover:bg-zinc-800 hover:shadow-sm dark:text-white">
        {post.photos && (
          <div className="relative w-full h-full rounded-lg cursor-pointer bg-secondary">
            <Image
              src={UrlPrefix + post.photos[0].hash}
              layout="fill"
              objectFit="cover"
              objectPosition="center"
              className="rounded-lg"
              alt=""
              quality={60}
            />

            {post.nsfw && (
              <div className="absolute inset-0 flex items-center justify-center backdrop-blur-2xl rounded-xl bg-black/40">
                <div className="text-center text-white">
                  {t('nsfw_warning')}
                </div>
              </div>
            )}

            <div className="absolute top-0 left-0 flex items-center justify-between w-full p-1 rounded-t-lg bg-white/80 dark:bg-zinc-900/80">
              <div className="flex items-center gap-1">
                <Link href={`/user/${post.author.username}`} passHref>
                  <Image
                    className="rounded-full"
                    src={
                      post.author.profile.startsWith('http')
                        ? post.author.profile
                        : UrlPrefix + post.author.profile
                    }
                    width={30}
                    height={30}
                    alt={t('profile_picture')}
                  />
                </Link>
                <Link href={`/user/${post.author.username}`}>
                  <a className="font-semibold">
                    {post.author.firstName} {post.author?.lastName}
                  </a>
                </Link>
              </div>
              <span>
                <TimeAgo date={post.createdAt} />
              </span>
            </div>
            <div className="absolute bottom-0 left-0 z-20 flex items-end justify-center w-full p-1 font-semibold text-white rounded-b-lg h-1/2 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent">
              {post.startYear}
              {post.startYear !== post.endYear && (
                <>
                  -<span>{post.endYear}</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

const Place: React.FC<PlaceProps> = ({ id }) => {
  const mapContext = useContext(MapContext); // get map context
  const meContext = useContext(MeContext); // get me context
  const { t } = useTranslation<string>();
  const placeQuery = useMapSidebarPlaceQuery({
    variables: { id },
  }); // get place data
  const postsQuery = useMapSidebarPostsQuery({
    variables: { input: { filter: { placeId: id } } },
  }); // get place posts
  const [isOpenEditPlaceModal, setOpenEditPlaceModal] =
    useState<boolean>(false);

  return (
    <>
      <EditPlaceModal
        isOpen={isOpenEditPlaceModal}
        setIsOpen={setOpenEditPlaceModal}
        name={placeQuery.data?.place.name}
        description={placeQuery.data?.place.description}
        id={id}
        refetch={async () => await placeQuery.refetch()}
      />

      <div className="relative w-full text-black cursor-pointer dark:text-white h-52 md:h-72 bg-secondary">
        {!placeQuery.loading && (
          <Image
            src={UrlPrefix + placeQuery.data?.place.preview?.hash}
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            className="bg-zinc-300 dark:bg-zinc-800/80"
            alt="Place picture"
          />
        )}

        <div className="absolute bottom-0 left-0 z-20 w-full h-full text-center bg-gradient-to-t from-[#000000ee] via-transparent to-transparent">
          <a className="absolute w-full px-2 text-4xl font-bold bottom-8 -translate-x-1/2 text-white">
            {placeQuery.data?.place.name ?? 'Place detail'}
          </a>
        </div>
        {meContext.me?.isAdmin && (
          <button
            onClick={() => setOpenEditPlaceModal(true)}
            className="absolute z-30 flex items-center px-2 py-1 font-semibold bg-white border border-gray-200 rounded shadow-sm gap-1.5 top-2 right-2 dark:bg-zinc-800 dark:border-zinc-900"
          >
            <HiPencil className="w-5 h-5" />
            {t('edit_place')}
          </button>
        )}

        <button
          className="absolute z-30 flex items-center px-2 py-1 font-semibold bg-white border border-gray-200 rounded shadow-sm gap-1.5 top-2 left-2 dark:bg-zinc-800 dark:border-zinc-900"
          onClick={() => mapContext.setSidebarPlace(null)}
        >
          <HiOutlineChevronLeft className="w-5 h-5" />
        </button>
      </div>
      <div className="flex justify-center py-2 gap-2">
        <button
          className="flex items-center px-4 py-2 border rounded-lg borer-gray-400 hover:bg-gray-100 gap-2"
          onClick={() => {
            if (!placeQuery.data) return;
            mapContext.setViewport({
              ...mapContext.viewport,
              latitude: placeQuery.data?.place.latitude,
              longitude: placeQuery.data?.place.longitude,
              zoom: 19,
            });
          }}
        >
          <HiOutlineLocationMarker /> {t('show_on_map')}
        </button>
        <button
          className="flex items-center px-4 py-2 border rounded-lg borer-gray-400 hover:bg-gray-100 gap-2"
          onClick={async () => {
            await navigator.clipboard.writeText(
              `https://www.histories.cc/?lat=${placeQuery.data?.place.latitude}&lng=${placeQuery.data?.place.longitude}&zoom=19&place=${mapContext.sidebarPlace}`
            );
            toast.success(t('link_copied'));
          }}
        >
          <HiOutlineShare /> {t('share')}
        </button>
        {meContext.data?.me && (
          <>
            <Link
              href={`/create/post?placeID=${mapContext.sidebarPlace}`}
              passHref
            >
              <button className="flex items-center px-4 py-2 border rounded-lg borer-gray-400 hover:bg-gray-100 gap-2">
                <HiOutlinePlusCircle />
                {t('add_photo')}
              </button>
            </Link>
          </>
        )}
      </div>
      {/* DESCRIPTION */}
      {placeQuery.data?.place.description && (
        <div className="px-4">
          <h3 className="text-lg font-semibold">{t('description')}:</h3>
          <p className="pt-1 pb-4">{placeQuery.data?.place.description}</p>
        </div>
      )}
      <div className="w-full border-b border-gray-200 dark:border-gray-800" />
      <div className="px-4">
        <h3 className="py-4 text-lg font-semibold">{t('posts')}:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {postsQuery.loading ? (
            [null, null, null].map((_, index) => (
              <div
                key={index}
                className="w-full h-64 rounded-lg bg-zinc-200 dark:bg-zinc-800/80 animate-pulse"
              />
            ))
          ) : (
            <>
              {postsQuery.data?.posts
                .filter((post) => post.photos[0]?.hash)
                .map((post) => (
                  <PlacePost key={post.id} post={post} />
                ))}
              {meContext.data?.me && (
                <Link
                  href={`/create/post?placeID=${mapContext.sidebarPlace}`}
                  passHref
                >
                  <div className="flex items-center justify-center w-full h-64  rounded-lg bg-zinc-200 dark:bg-zinc-800/80 hover:bg-zinc-300 dark:hover:bg-zinc-800">
                    <div className="p-2 border-2 rounded-lg border-zinc-400 dark:border-zinc-700 text-zinc-600">
                      <HiPlus className="w-5 h-5" />
                    </div>
                  </div>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Place;
