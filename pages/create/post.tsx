import { Separator } from '@components/Elements';
import Button from '@components/Elements/Buttons/Button';
import ArrowIcon from '@components/Elements/Icons/ArrowIcon';
import { Layout } from '@components/Layouts';
import { Search } from '@components/Templates/MainPage';
import { useCreatePostMutation } from '@graphql/post.graphql';
import { useMeQuery } from '@graphql/user.graphql';
import { RedirectAnonymous } from '@lib/functions/ServerSideProps';
import { Field, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import MapGL, {
  GeolocateControl,
  Marker,
  NavigationControl,
} from 'react-map-gl';

import { Maybe } from '../../.cache/__types__';

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

const Login: FC = () => {
  // for reading coordinates from query params
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const { data, loading, error } = useMeQuery();
  const [createPostMutation] = useCreatePostMutation();
  const [coordinates, setCoordinates] = useState([21, 20]);
  const [marker, setMarker] = useState({
    latitude: 40,
    longitude: -100,
  });
  const [events, logEvents] = useState({});
  const [tags, setTags] = useState<Array<string>>([]);
  const [newTag, setNewTag] = useState<string>('');
  const [searchCoordinates, setSearchCoordinates] = useState({
    lat: 50,
    lng: 15,
  });
  const [file, setFile] = useState<File[]>([]);

  const onMarkerDragStart = useCallback((event) => {
    logEvents((_events) => ({ ..._events, onDragStart: event.lngLat }));
  }, []);

  const onMarkerDrag = useCallback((event) => {
    logEvents((_events) => ({ ..._events, onDrag: event.lngLat }));
  }, []);

  const onMarkerDragEnd = useCallback((event) => {
    logEvents((_events) => ({ ..._events, onDragEnd: event.lngLat }));
    setMarker({
      longitude: event.lngLat[0],
      latitude: event.lngLat[1],
    });
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setCoordinates([position.coords.latitude, position.coords.longitude]);
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
    setMarker({
      longitude: searchCoordinates.lng,
      latitude: searchCoordinates.lat,
    });
  }, [searchCoordinates]);

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
    setMarker({
      // @ts-ignore
      longitude: parseFloat(router.query?.lng ?? 15),
      // @ts-ignore
      latitude: parseFloat(router.query?.lat ?? 50),
    });
  }, []);
  const [collapsed, setCollapsed] = useState(true);
  const [placeDetail, setPlaceDetail] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Maybe<string>>(null);
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
  const { t } = useTranslation();
  if (loading) return <div>loading xxx</div>;
  if (error) return <div>error</div>;

  if (data?.me === null) router.replace('/');
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
      <Formik
        initialValues={{
          photoDate: '',
          description: '',
        }}
        onSubmit={async (values) => {
          setIsLoading(true);
          try {
            await createPostMutation({
              variables: {
                ...values,
                photoDate: Date.parse(values.photoDate).toString(),
                hashtags: '',
                latitude: marker.latitude,
                longitude: marker.longitude,
                photo: file,
              },
            });
            router.push('/');
          } catch (error) {
            // @ts-ignore
            toast.error(error.message);
          }
          setIsLoading(false);
        }}
      >
        {() => (
          <Form>
            <div className="w-full">
              <div className="w-full max-w-4xl px-6 m-auto xl:px-0">
                <div className="flex pt-6 pb-8">
                  <div className="py-2">
                    {/* PAGE HEADING */}
                    <h1 className="pb-1 text-5xl font-bold tracking-tight">
                      {t('Create post')}
                    </h1>
                  </div>
                </div>
                <Separator />
                {/* LOCATION SELECT */}
                <div className="flex w-full">
                  <div className="flex flex-col p-2 gap-2">
                    <Search setSearchCoordinates={setSearchCoordinates} />
                    <motion.div
                      className="flex flex-col p-2 border border-gray-300 cursor-pointer gap-1 rounded-xl"
                      animate={{ height: placeDetail ? '100%' : 'auto' }}
                      transition={{
                        duration: 0.2,
                        ease: 'easeInOut',
                      }}
                    >
                      <div
                        className="flex items-center gap-1"
                        onClick={() => setPlaceDetail(!placeDetail)}
                      >
                        <motion.span
                          animate={{ rotate: placeDetail ? '270deg' : '90deg' }}
                          transition={{
                            duration: 0.2,
                            ease: 'easeInOut',
                          }}
                        >
                          <ArrowIcon className={'w-5 h-5 text-black'} />
                        </motion.span>
                        <a className="font-medium text-black">Selected place</a>
                      </div>
                    </motion.div>
                  </div>
                  <div className="w-full p-2">
                    <motion.div
                      className="flex flex-col w-full p-2 text-gray-500 bg-white border border-gray-300 rounded-xl dark:border-gray-600 dark:text-gray-400 gap-2"
                      animate={{ height: collapsed ? 'auto' : '40vh' }}
                      transition={{
                        duration: 0.2,
                        ease: 'easeInOut',
                      }}
                    >
                      <div
                        className="flex items-center cursor-pointer gap-1"
                        onClick={() => setCollapsed(!collapsed)}
                      >
                        <motion.span
                          animate={{ rotate: collapsed ? '270deg' : '90deg' }}
                          transition={{
                            duration: 0.2,
                            ease: 'easeInOut',
                          }}
                        >
                          <ArrowIcon className={'w-5 h-5 text-black'} />
                        </motion.span>
                        <a className="font-medium text-black">Select on map</a>
                      </div>
                      {!collapsed && (
                        <MapGL
                          {...viewport}
                          width="100%"
                          height="100%"
                          className="rounded-xl"
                          mapboxApiAccessToken={
                            process.env.NEXT_PUBLIC_MAPBOX_TOKEN
                          }
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
                            longitude={marker.longitude}
                            latitude={marker.latitude}
                            offsetTop={-20}
                            offsetLeft={-10}
                            draggable
                            onDragStart={onMarkerDragStart}
                            onDrag={onMarkerDrag}
                            onDragEnd={onMarkerDragEnd}
                          >
                            <svg
                              height={20}
                              viewBox="0 0 24 24"
                              style={{
                                fill: '#d00',
                                stroke: 'none',
                              }}
                            >
                              <path
                                d="M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
C20.1,15.8,20.2,15.8,20.2,15.7z"
                              />
                            </svg>
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
                      )}
                    </motion.div>
                  </div>
                </div>
                <div className="flex w-full">
                  <div className="w-full p-2">
                    <div>
                      <label>Photo date</label>
                      <Field
                        name="photoDate"
                        type="date"
                        className="w-full h-10 px-3 mt-2 mb-1 leading-tight text-gray-700 border rounded-lg shadow appearance-none focus:outline-none focus:shadow-outline"
                        // disable selecting date from future in calendar pop-up
                        max={new Date().toISOString().split('T')[0]}
                      />

                      <br />
                    </div>
                    <div>
                      <label>Description</label>
                      <Field
                        name="description"
                        type="text"
                        className="w-full h-10 px-3 mt-2 mb-1 leading-tight text-gray-700 border rounded-lg shadow appearance-none focus:outline-none focus:shadow-outline"
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
                  <div className="p-2">
                    <DropZoneComponent setFiles={setFile} />
                    Selected files {file.length}
                  </div>
                </div>
              </div>
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

              <Button loading={isLoading}>submit</Button>
            </div>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export const getServerSideProps = RedirectAnonymous;

export default Login;
