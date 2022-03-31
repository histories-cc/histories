import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import UserLayout from '@components/layouts/User';
import DropdownTransition from '@components/modules/dropdown/DropdownTransition';
import DeleteCollectionModal from '@components/modules/modals/DeleteCollectionModal';
import Card from '@components/modules/userPage/Card';
import { CollectionDocument, CollectionQuery, usePostsQuery } from '@graphql';
import { Dialog, Menu, Transition } from '@headlessui/react';
import UrlPrefix from '@src/constants/IPFSUrlPrefix';
import {
  GetCookieFromServerSideProps,
  IsJwtValid,
  SSRRedirect,
} from '@src/functions';
import { GetServerSidePropsContext } from 'next';
import Image from 'next/image';
import React, { Fragment, useState } from 'react';
import { Blurhash } from 'react-blurhash';
import { useTranslation } from 'react-i18next';
import { HiOutlineChevronDown } from 'react-icons/hi';

const CheckPost: React.FC<{
  collection: NonNullable<CollectionQuery['collection']>;
}> = ({ collection }) => {
  const { data, loading, error } = usePostsQuery({
    variables: { input: { filter: { collectionId: collection.id } } },
  });
  const [photoDetail, setPhotoDetail] = useState<number | null>(null); // when open value is id of opened post, otherwise null
  const { t } = useTranslation<string>();
  const [isDeleteCollectionModalOpen, setIsDeleteCollectionModalOpen] =
    useState<boolean>(false);
  return (
    <UserLayout
      user={collection.author}
      currentTab="collections"
      heading={collection.name}
      head={{
        title: `${collection.name} | Histories`,
        description:
          collection.description ??
          `${collection.author.firstName}'s collection`,
        canonical: `https://www.histories.cc/collection/${collection.id}`,
        openGraph: {
          title: `Collection | Histories`,
          type: 'website',
          url: `https://www.histories.cc/collection/${collection.id}`,
          description:
            collection.description ??
            `${collection.author.firstName}'s collection`,
          site_name: 'Collection',
        },
      }}
    >
      {photoDetail !== null && (
        <Transition appear show={photoDetail !== null} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto"
            onClose={() => setPhotoDetail(null)}
          >
            <div className="min-h-screen px-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-gray-900 opacity-50" />
              </Transition.Child>

              {/* This element is to trick the browser into centering the modal contents. */}
              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="inline-block w-full h-full max-w-md p-6 my-8 overflow-hidden text-left align-middle bg-white shadow-xl max-h-[70vh] transition-all transform rounded-2xl">
                  <div className="flex w-full">
                    {(data?.posts.findIndex(
                      (post) => post.id === photoDetail
                    ) || 0) > 0 && (
                      <button
                        onClick={() => {
                          const postIndex =
                            data?.posts.findIndex(
                              (post) => post.id === photoDetail
                            ) || 0;
                          setPhotoDetail(data!.posts[postIndex - 1].id);
                        }}
                      >
                        {'<'}
                      </button>
                    )}
                    <div className="relative w-full h-12">
                      <Image
                        src={
                          UrlPrefix +
                          data?.posts[
                            data!.posts.findIndex(
                              (post) => post.id === photoDetail
                            )
                          ].photos[0].hash
                        }
                        layout="fill"
                        objectFit="contain"
                        placeholder="empty"
                        objectPosition="center"
                        alt="Photo"
                      />
                    </div>
                    {(data?.posts.findIndex(
                      (post) => post.id === photoDetail
                    ) || 0) <
                      (data?.posts?.length || 0) - 1 && (
                      <button
                        onClick={() => {
                          const postIndex =
                            data?.posts.findIndex(
                              (post) => post.id === photoDetail
                            ) || 0;
                          setPhotoDetail(data!.posts[postIndex + 1].id);
                        }}
                      >
                        {'>'}
                      </button>
                    )}
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      )}

      <DeleteCollectionModal
        isOpen={isDeleteCollectionModalOpen}
        setIsOpen={setIsDeleteCollectionModalOpen}
      />
      <div className="flex items-center justify-between pr-4">
        <p className="py-4">{collection.description}</p>

        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center px-2 py-1 font-semibold text-gray-600 border border-gray-300 rounded-lg gap-2">
            Options
            <HiOutlineChevronDown />
          </Menu.Button>
          <Transition as={Fragment} {...DropdownTransition}>
            <Menu.Items as="div" className="dropdown">
              <Menu.Item as="div" className="rounded-t-lg dropdown-item">
                {t('edit_collection')}
              </Menu.Item>
              <Menu.Item
                as="div"
                className="dropdown-item-danger"
                onClick={() => setIsDeleteCollectionModalOpen(true)}
              >
                {t('delete_collection')}
              </Menu.Item>
              <Menu.Item as="div" className="rounded-b-lg dropdown-item">
                {t('close')}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
      {loading ? (
        'loading posts'
      ) : error ? (
        'something went wront, try refreshing page'
      ) : data?.posts.length == 0 ? (
        <Card>
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
              className="w-8 h-8 text-brand-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              ></path>
            </svg>
            <div>{t('no_posts')}</div>
          </>
        </Card>
      ) : (
        <section className="mt-4 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 ">
          {data?.posts.map((post) => (
            <div onClick={() => setPhotoDetail(post.id)} key={post.id}>
              <PostMiniature post={post} />
            </div>
          ))}
        </section>
      )}
    </UserLayout>
  );
};

const PostMiniature: React.FC<{ post: any }> = ({ post }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  return (
    <div className="relative w-full h-48 bg-white border rounded-lg dark:border-[#373638] dark:bg-[#2b2b2b] shadow-sm dark:shadow-md">
      {isLoading && (
        <div className="flex items-center justify-center w-full h-full">
          <Blurhash
            hash={post.photos[0].blurhash}
            width={'100%'}
            height={'100%'}
            punch={1}
          />
        </div>
      )}
      <Image
        src={UrlPrefix + post.photos[0].hash}
        layout="fill"
        objectFit="contain"
        placeholder="blur"
        blurDataURL={'https://ipfs.io/ipfs' + post.photos[0].hash}
        onLoadingComplete={() => setIsLoading(false)}
        objectPosition="center"
        alt="Profile picture"
      />
    </div>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { query, req } = ctx;
  if (typeof query.id !== 'string') return { props: { id: null } };
  const jwt = GetCookieFromServerSideProps(req.headers.cookie, 'jwt');
  const anonymous = jwt === null ? true : IsJwtValid(jwt);

  // create new apollo graphql client
  const client = new ApolloClient({
    link: createHttpLink({
      uri:
        process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ??
        'http://localhost:3000/api/graphql',
      headers: {
        authorization: jwt ? `Bearer ${jwt}` : '',
      },
    }),

    cache: new InMemoryCache(),
  });

  // fetch user query
  if (!req.url?.startsWith('_next')) {
    try {
      const { data: collectionData }: { data: CollectionQuery } =
        await client.query({
          query: CollectionDocument,
          variables: { id: parseInt(query.id) },
        });

      // return props
      return {
        props: {
          collection: collectionData.collection,
          anonymous,
        },
      };
    } catch (e) {
      return SSRRedirect('/404?error=collection_does_not_exist');
    }
  }
  // this should not be needed 🤷‍♀️
  return {
    props: {},
  };
};

export default CheckPost;
