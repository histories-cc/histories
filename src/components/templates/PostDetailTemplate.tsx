import { PlaceDetailModal } from '@components/modules/modals/PlaceDetailModal';
import PostDetailCommentSection from '@components/modules/postDetail/Comments';
import { PostQuery } from '@graphql';
import UrlPrefix from '@src/constants/IPFSUrlPrefix';
import MeContext from '@src/contexts/MeContext';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useState } from 'react';
import { Blurhash } from 'react-blurhash';
import { useTranslation } from 'react-i18next';
import { HiOutlineLocationMarker, HiOutlinePlusCircle } from 'react-icons/hi';

interface PostDetailTemplateProps {
  post: PostQuery['post'];
}

const PostDetailTemplate: React.FC<PostDetailTemplateProps> = ({ post }) => {
  const { t } = useTranslation();
  const [currentPhoto, setCurrentPhoto] = useState<number>(0);
  const [placeDetailModal, setPlaceDetailModal] = useState<boolean>(false); // open place detail modal
  const [showImage, setShowImage] = useState<boolean>(false);
  const meContext = useContext(MeContext);

  return (
    <main
      className="block w-full font-medium text-gray-900"
      style={{
        height: 'calc(100vh - 56px)',
      }}
    >
      {/* PLACE DETAIL MODAL */}
      <PlaceDetailModal
        isOpen={placeDetailModal}
        setIsOpen={setPlaceDetailModal}
        id={post.place.id}
        place={post.place}
      />

      <div className="flex flex-col w-full h-full lg:flex-row ">
        <div className="relative w-full min-h-[50vh]">
          <Blurhash
            hash={post.photos[currentPhoto].blurhash}
            height="100%"
            width="100%"
            punch={1}
            style={{ borderRadius: '50%' }}
          />
          <Image
            src={UrlPrefix + post.photos[currentPhoto].hash}
            layout="fill"
            objectFit="contain"
            className="rounded-xl"
            alt="photo"
          />

          {/* NSFW accept */}
          {post.nsfw &&
            (showImage ? (
              <button
                className="absolute z-30 flex items-center px-2 py-1 font-semibold text-black bg-white border border-gray-200 rounded shadow-sm gap-1.5 bottom-2 right-2"
                onClick={() => setShowImage(false)}
              >
                {t('hide')}
              </button>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center backdrop-blur-2xl bg-black/40">
                <div className="text-center text-white">
                  <div className="text-2xl">{t('nsfw_warning')}</div>
                  <div className="text-lg">{t('nsfw_warning_description')}</div>
                  <div className="mt-4">
                    <button
                      className="px-4 py-2 font-semibold text-white rounded-full bg-secondary"
                      onClick={() => setShowImage(true)}
                    >
                      {t('show_image')}
                    </button>
                  </div>
                </div>
              </div>
            ))}

          <div className="absolute hidden bg-white border border-gray-200 lg:flex p-0.5 top-3 right-[10%] lg:right-4 rounded-xl shadow-sm lg:w-96 w-[80%]">
            <div
              className="relative w-20 h-20 rounded-xl aspect-square"
              onClick={() => setPlaceDetailModal(true)}
            >
              <Blurhash
                hash={post.place.preview!.blurhash}
                height="100%"
                width="100%"
                className="rounded-xl blurhash"
                punch={1}
              />
              <Image
                src={UrlPrefix + post.place.preview?.hash}
                layout="fill"
                objectFit="cover"
                className="rounded-xl"
                alt="Image of the place"
              />
            </div>
            <div className="flex flex-col items-center w-full h-20 overflow-y-hidden p-1.5">
              <a className="font-semibold">{post.place.name}</a>
              <div className="flex justify-center py-2 gap-2">
                <Link
                  href={`/?lat=${post.place.latitude}&lng=${post.place.longitude}&zoom=28.5&place=${post.place.id}`}
                >
                  <a className="flex items-center px-2 py-1 rounded-lg gap-1.5 hover:bg-gray-100">
                    <HiOutlineLocationMarker /> {t('show_on_map')}
                  </a>
                </Link>
                {meContext.data?.me && (
                  <Link href={`/create/post?placeID=${post.place.id}`}>
                    <a className="flex items-center px-2 py-1 rounded-lg gap-1.5 hover:bg-gray-100">
                      <HiOutlinePlusCircle />
                      {t('add_photo')}
                    </a>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full lg:max-w-md">
          <PostDetailCommentSection post={post} />
        </div>
      </div>
    </main>
  );
};

export default PostDetailTemplate;
