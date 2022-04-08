import { Input } from '@components/elements';
import Button from '@components/elements/buttons/Button';
import Suspense from '@components/elements/Suspense';
import { Layout } from '@components/layouts';
import Search from '@components/modules/Search';
import {
  useCreatePostMapPlacesQuery,
  useCreatePostMutation,
  useCreatePostSelectedPlaceLazyQuery,
} from '@graphql';
import { Tab } from '@headlessui/react';
import UrlPrefix from '@src/constants/IPFSUrlPrefix';
import {
  GetCookieFromServerSideProps,
  IsJwtValid,
  SSRRedirect,
} from '@src/functions';
import { GetServerSidePropsContext } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { Blurhash } from 'react-blurhash';
import { useDropzone } from 'react-dropzone';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { HiLocationMarker } from 'react-icons/hi';
import MapGL, {
  GeolocateControl,
  Marker,
  NavigationControl,
} from 'react-map-gl';

interface ICreatePostInput {
  year: string;
  month: string | null;
  day: string | null;
  startDay: string | null;
  startMonth: string | null;
  startYear: string;
  endDay: string | null;
  endMonth: string | null;
  endYear: string;
  description: string;
}

const DropZoneComponent = ({
  setFiles,
}: {
  setFiles: React.Dispatch<File[]>;
}) => {
  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    multiple: true,
    accept: 'image/*',
  });

  return (
    <div className={`rounded-2xl p-4 mt-4 bg-gray-100 cursor-pointer`}>
      <div
        {...getRootProps()}
        className={`w-full h-30 p-8 ${
          isDragAccept
            ? 'border-green-400'
            : isDragReject
            ? 'border-red-400'
            : 'border-[#949191]'
        } border-2 rounded-2xl border-dashed`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-gray-600">
          <p>
            {isDragActive
              ? isDragReject
                ? 'Please upload images only'
                : 'Drop images here'
              : 'Drag and drop images here, or click to select images'}
          </p>
        </div>
      </div>
    </div>
  );
};

interface CreatePostPageProps {
  placeID: number | null;
  latitude: number | null;
  longitude: number | null;
}

const CreatePostPage: React.FC<CreatePostPageProps> = ({
  placeID,
  latitude,
  longitude,
}) => {
  // months
  let months: string[] = [];
  for (let i = 1; i <= 12; i++) {
    months.push(new Date(0, i, 0).toLocaleString('en', { month: 'long' }));
  }
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(
    placeID
  );

  const [getSelectedPlace, selectedPlaceQuery] =
    useCreatePostSelectedPlaceLazyQuery();
  const mapPlacesQuery = useCreatePostMapPlacesQuery();

  // for reading coordinates from query params
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [createPostMutation] = useCreatePostMutation();

  const [timeSelectMode, setTimeSelectMode] = useState<number>(0);

  const [tags, setTags] = useState<Array<string>>([]);
  const [newTag, setNewTag] = useState<string>('');
  const [searchCoordinates, setSearchCoordinates] = useState({
    lat: latitude ?? 50,
    lng: longitude ?? 15,
  });
  const [file, setFile] = useState<File[]>([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setSearchCoordinates({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, []);

  const [viewport, setViewport] = useState({
    latitude: searchCoordinates.lat,
    longitude: searchCoordinates.lng,
    zoom: 3.5,
    bearing: 0,
    pitch: 0,
  });

  useEffect(() => {
    setViewport({
      ...viewport,
      longitude: searchCoordinates.lng,
      latitude: searchCoordinates.lat,
      zoom: 14,
    });
  }, [searchCoordinates]);

  useEffect(() => {
    if (selectedPlaceId !== null)
      getSelectedPlace({ variables: { id: selectedPlaceId } });
  }, [selectedPlaceId]);

  // on load read set marker & viewport coordinates by query params
  useEffect(() => {
    setViewport({
      ...viewport,
      // @ts-ignore
      longitude: parseFloat(router.query?.lng ?? 15),
      // @ts-ignore
      latitude: parseFloat(router.query?.lat ?? 50),
      zoom: 14,
    });
  }, []);

  useEffect(() => {
    if (newTag.slice(-1) === ' ') {
      if (newTag !== '') {
        const newTags = tags;
        if (!tags.includes(newTag.substring(0, newTag.length - 1))) {
          newTags.push(newTag.substring(0, newTag.length - 1));
          setTags(newTags);
        }
      }
      setNewTag('');
    }
  }, [newTag]);

  const {
    register,
    handleSubmit,
    formState: {},
    watch,
  } = useForm<ICreatePostInput>();

  const { t } = useTranslation();

  const onSubmit: SubmitHandler<ICreatePostInput> = async (data) => {
    setIsLoading(true);

    const date =
      timeSelectMode === 0
        ? {
            startYear: parseInt(data.year),
            startMonth: data?.month ? parseInt(data.month) : null,
            startDay: data?.day ? parseInt(data.day) : null,
            endYear: parseInt(data.year),
            endMonth: data?.month ? parseInt(data.month) : null,
            endDay: data?.day ? parseInt(data.day) : null,
          }
        : {
            startYear: parseInt(data.startYear),
            startMonth: data?.startMonth ? parseInt(data.startMonth) : null,
            startDay: data?.startDay ? parseInt(data.startDay) : null,
            endYear: parseInt(data.endYear),
            endMonth: data?.endMonth ? parseInt(data.endMonth) : null,
            endDay: data?.endDay ? parseInt(data.endDay) : null,
          };
    try {
      await createPostMutation({
        variables: {
          input: {
            ...date,
            placeID: selectedPlaceId,
            description: data.description,
            latitude: viewport.latitude,
            longitude: viewport.longitude,
            photo: file,
          },
        },
      });
      toast.success(t('post_created'));
      router.push('/');
    } catch (error) {
      toast.error(t('create_post_error'));
    }
    setIsLoading(false);
  };

  return (
    <Layout
      head={{
        title: `New post | hiStories`,
        description: `Create new post on HiStories`,
        canonical: 'https://www.histories.cc/create/post',
        openGraph: {
          title: `New post | HiStories`,
          type: 'website',
          url: 'https://www.histories.cc/create/post',
          description: `Create new post on HiStories`,
          site_name: 'New post page',
        },
      }}
    >
      <div
        className="w-full grid grid-cols-2"
        style={{ height: 'calc(100vh - 56px)' }}
      >
        <div className="relative w-full h-full">
          <MapGL
            latitude={
              selectedPlaceId !== null && selectedPlaceQuery.data !== undefined
                ? selectedPlaceQuery.data?.place.latitude
                : viewport.latitude
            }
            longitude={
              selectedPlaceId !== null && selectedPlaceQuery.data !== undefined
                ? selectedPlaceQuery.data.place.longitude
                : viewport.longitude
            }
            zoom={viewport.zoom}
            width="100%"
            height="100%"
            mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            onViewportChange={setViewport}
            dragRotate={false}
          >
            <GeolocateControl
              style={{
                bottom: 186,
                right: 0,
                padding: '10px',
              }}
              positionOptions={{ enableHighAccuracy: true }}
            />
            <Marker
              latitude={
                selectedPlaceId !== null &&
                selectedPlaceQuery.data !== undefined
                  ? selectedPlaceQuery.data?.place.latitude
                  : viewport.latitude
              }
              longitude={
                selectedPlaceId !== null &&
                selectedPlaceQuery.data !== undefined
                  ? selectedPlaceQuery.data.place.longitude
                  : viewport.longitude
              }
            >
              <HiLocationMarker className="w-10 h-10 text-brand -translate-x-1/2 -translate-y-full" />
            </Marker>
            <NavigationControl
              style={{
                bottom: 240,
                right: 0,
                padding: '10px',
              }}
              showCompass={false}
            />
          </MapGL>
          {/* LOCATION SELECT */}
          <div className="absolute w-64 top-2 left-2">
            <Search setSearchCoordinates={setSearchCoordinates} />
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full p-4">
          {/* PAGE HEADING */}
          <h1 className="pb-1 text-3xl font-bold tracking-tight">
            {t('Create post')}
          </h1>
          {selectedPlaceId !== null ? (
            <div className="flex gap-4">
              <div className="relative w-48 h-48 rounded-md">
                {!selectedPlaceQuery.loading &&
                selectedPlaceQuery.data !== undefined ? (
                  <>
                    <Blurhash
                      className="blurhash"
                      hash={selectedPlaceQuery.data!.place!.preview!.blurhash}
                      width="100%"
                      height="100%"
                      punch={1}
                    />
                    <Image
                      layout="fill"
                      objectFit="cover"
                      objectPosition="center"
                      className="rounded-md"
                      src={
                        UrlPrefix +
                        selectedPlaceQuery!.data!.place!.preview!.hash
                      }
                      width="100%"
                      height="100%"
                      alt={t('place_preview')}
                    />
                    {selectedPlaceQuery.data?.place?.name && (
                      <div className="absolute left-0 z-10 flex items-center justify-center w-full p-2 font-semibold text-center text-white break-words bottom-1/4 h-1/4 bg-black/40 rounded-t-md">
                        {selectedPlaceQuery.data?.place?.name}
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 z-10 flex items-center justify-center w-full p-2 font-semibold text-center text-white break-all h-1/4 bg-brand rounded-b-md">
                      {t('selected_place')}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full rounded-lg bg-zinc-200 dark:bg-zinc-800/80 animate-pulse" />
                )}
              </div>
              <div
                className="relative w-48 h-48 rounded-md grayscale"
                onClick={() => setSelectedPlaceId(null)}
              >
                {!selectedPlaceQuery.loading &&
                selectedPlaceQuery.data !== undefined ? (
                  <>
                    <Blurhash
                      className="blurhash"
                      hash={
                        mapPlacesQuery.data?.places[0].preview?.blurhash ??
                        selectedPlaceQuery.data!.place!.preview!.blurhash
                      }
                      width="100%"
                      height="100%"
                      punch={1}
                    />
                    <Image
                      layout="fill"
                      objectFit="cover"
                      objectPosition="center"
                      className="rounded-md"
                      src={
                        UrlPrefix +
                        (mapPlacesQuery.data?.places[0].preview?.hash ??
                          selectedPlaceQuery!.data!.place!.preview!.hash)
                      }
                      width="100%"
                      height="100%"
                      alt={t('place_preview')}
                    />

                    <div className="absolute top-0 left-0 z-10 flex items-center justify-center w-full h-full p-2 font-semibold text-center text-white break-all cursor-pointer bg-black/40 rounded-md">
                      {t('back_to_place_selection')}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full rounded-lg bg-zinc-200 dark:bg-zinc-800/80 animate-pulse" />
                )}
              </div>
            </div>
          ) : (
            <div className="w-full overflow-x-auto gap-2">
              <div className="flex gap-4">
                <Suspense
                  condition={!mapPlacesQuery.loading}
                  fallback={[null, null, null, null].map((_, index) => (
                    <div key={index}>
                      <div className="relative w-48 h-48 rounded-md bg-zinc-300 animate-pulse"></div>
                    </div>
                  ))}
                >
                  {mapPlacesQuery.data?.places.map((place, index) => (
                    <div key={index}>
                      <div
                        className="relative w-48 h-48 rounded-md"
                        onClick={() => setSelectedPlaceId(place.id)}
                      >
                        <Blurhash
                          className="blurhash"
                          hash={place.preview!.blurhash}
                          width="100%"
                          height="100%"
                          punch={1}
                        />
                        <Image
                          layout="fill"
                          objectFit="cover"
                          objectPosition="center"
                          className="rounded-md"
                          src={UrlPrefix + place.preview?.hash}
                          width="100%"
                          height="100%"
                          alt={t('place_preview')}
                        />
                        {place?.name && (
                          <div className="absolute left-0 z-10 flex items-center justify-center w-full p-2 font-semibold text-center text-white break-words bottom-[20%] bg-black/40 rounded-t-md">
                            {place?.name}
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 z-10 flex items-center justify-center w-full p-2 font-semibold text-center text-white break-all cursor-pointer h-1/5 bg-brand rounded-b-md">
                          {t('select_place')}
                        </div>
                      </div>
                    </div>
                  ))}
                </Suspense>
              </div>
            </div>
          )}
          <div className="w-full max-w-4xl px-6 m-auto xl:px-0">
            <label>Photo date</label>
            <Tab.Group
              selectedIndex={timeSelectMode}
              onChange={setTimeSelectMode}
            >
              <Tab.List className="flex gap-2">
                {['date', 'timespan'].map((name, index) => (
                  <Tab
                    key={index}
                    className={({ selected }) =>
                      `px-4 py-1 rounded-lg shadow ${
                        selected
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-black hover:bg-gray-200'
                      }`
                    }
                  >
                    {t(name)}
                  </Tab>
                ))}
              </Tab.List>
              <Tab.Panels>
                <Tab.Panel>
                  <div className="pt-4 grid grid-cols-[5em_12em_6em] gap-2">
                    <Input
                      register={register}
                      label={t('day')}
                      name="day"
                      options={{}}
                      type="number"
                      inputProps={{
                        min: 1,
                        max: 31,
                      }}
                    />

                    <label className="pb-2">
                      {/* LABEL */}
                      <span className="formInputLabel">{t('month')}</span>

                      <select className="formInput" {...register('month')}>
                        <option value={undefined} />
                        {months.map((month, index) => (
                          <option key={index} value={index + 1}>
                            {month}
                          </option>
                        ))}
                      </select>
                    </label>

                    <Input
                      label={`${t('year')} *`}
                      register={register}
                      name="year"
                      options={{}}
                      inputProps={{ max: new Date().getFullYear() }}
                      type="number"
                    />
                  </div>

                  <p className="pb-2 text-gray-600">
                    Fields with * are required
                  </p>
                </Tab.Panel>
                <Tab.Panel>
                  <div className="pt-4 grid grid-cols-[2.5em_5em_12em_6em] gap-x-2">
                    <div className="flex items-center">From</div>
                    <Input
                      register={register}
                      label={t('day')}
                      name="startDay"
                      options={{}}
                      type="number"
                      inputProps={{
                        min: 1,
                        max: 31,
                      }}
                    />
                    <label className="pb-2">
                      {/* LABEL */}
                      <span className="formInputLabel">{t('month')}</span>

                      <select className="formInput" {...register('startMonth')}>
                        <option value={undefined} />
                        {months.map((month, index) => (
                          <option key={index} value={index + 1}>
                            {month}
                          </option>
                        ))}
                      </select>
                    </label>
                    <Input
                      label={`${t('year')} *`}
                      register={register}
                      name="startYear"
                      options={{}}
                      inputProps={{ max: new Date().getFullYear() }}
                      type="number"
                    />{' '}
                    <div className="flex items-center pb-1">To</div>
                    <Input
                      register={register}
                      name="endDay"
                      options={{}}
                      type="number"
                      inputProps={{
                        min: 1,
                        max: 31,
                      }}
                    />
                    <label className="pb-2">
                      <select className="formInput" {...register('endMonth')}>
                        <option value={undefined} />
                        {months.map((month, index) => (
                          <option key={index} value={index + 1}>
                            {month}
                          </option>
                        ))}
                      </select>
                    </label>
                    <Input
                      register={register}
                      name="endYear"
                      options={{}}
                      inputProps={{
                        min: parseInt(watch('startYear') ?? '0'),
                        max: new Date().getFullYear(),
                      }}
                      type="number"
                    />
                  </div>

                  <p className="pb-2 text-gray-600">
                    Fields with * are required
                  </p>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
            <div>
              <Input
                label={t('description')}
                register={register}
                name="description"
                options={{}}
                type="textarea"
              />

              <br />
            </div>
            <label>hashtags</label>
            <input
              className="w-full h-10 px-3 mt-2 mb-1 leading-tight text-gray-700 border rounded-lg shadow appearance-none focus:outline-none focus:shadow-outline"
              name="hashtags"
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
            />
          </div>
          <div className="p-10 m-auto max-w-[27rem]">
            <div className="mt-[60px]"></div>
            <div className="flex w-full gap-2">
              {tags.map((tag, index) => {
                return (
                  <div
                    className="p-2 text-white bg-indigo-500 rounded-xl"
                    key={index}
                  >
                    #{tag}
                    <button
                      className="ml-4 text-red-300"
                      onClick={() => {
                        const newTags = tags.filter((x) => x !== tag);
                        setTags(newTags);
                      }}
                    >
                      x
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="p-2">
              <DropZoneComponent setFiles={setFile} />
              Selected files {file.length}
            </div>
            <Button loading={isLoading}>submit</Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req, query } = ctx;
  const cookies = req.headers.cookie; // get cookies

  const jwt = GetCookieFromServerSideProps(cookies, 'jwt');

  // if JWT is null redirect
  if (jwt === null) return SSRRedirect('/login');
  // if there is JWT, verify it
  else if (IsJwtValid(jwt)) {
    const placeID =
      typeof query.placeID === 'string' ? parseFloat(query.placeID) : null;
    const latitude =
      typeof query.latitude === 'string' ? parseFloat(query.latitude) : null;
    const longitude =
      typeof query.longitude === 'string' ? parseFloat(query.longitude) : null;
    return {
      props: {
        placeID,
        latitude,
        longitude,
      },
    };
  } else return SSRRedirect('/login');
};
export default CreatePostPage;
