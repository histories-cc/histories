import { Comment } from '@components/Comment';
import CameraIcon from '@components/Icons/CameraIcon';
import ChevronIcon from '@components/Icons/Chevron';
import MarkerIcon from '@components/Icons/MarkerIcon';
import ShareIcon from '@components/Icons/ShareIcon';
import { Menu, Modal } from '@components/Modal';
import { PostCard } from '@components/PostCard';
import { TimeLine } from '@components/TimeLine';
import { usePathsQuery, usePlaceQuery } from '@graphql/geo.graphql';
import { useCreateCommentMutation, usePostQuery } from '@graphql/post.graphql';
import { useDeleteMutation } from '@graphql/post.graphql';
import {
  useLikeMutation,
  useReportMutation,
  useUnfollowMutation,
  useUnlikeMutation,
} from '@graphql/relations.graphql';
import { useIsLoggedQuery } from '@graphql/user.graphql';
import { DotsHorizontalIcon } from '@heroicons/react/solid';
import GeneratedProfileUrl from '@lib/functions/GeneratedProfileUrl';
import { Viewport } from '@lib/types/viewport';
import { Avatar, Button } from '@nextui-org/react';
import { StringValueNode } from 'graphql';
import Image from 'next/image';
import image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { AiFillLike, AiOutlineComment, AiOutlineMore } from 'react-icons/ai';
import { FiSend } from 'react-icons/fi';
import { MdPhotoCamera } from 'react-icons/md';
import ReactMapGL, {
  FlyToInterpolator,
  GeolocateControl,
  Layer,
  Marker,
  NavigationControl,
  Source,
} from 'react-map-gl';
import Gallery from 'react-photo-gallery';
import TimeAgo from 'react-timeago';
import useSuperCluster from 'use-supercluster';

import UpdateUrl from './UpdateUrl';

type PlaceProps = {
  id: number;
  latitude: number;
  longitude: number;
  posts: Array<{
    id: number;
    createdAt: number;
    postDate: number;
    description: string;
    url: Array<string>;
  }>;
};

const GetBounds = (bounds: {
  _ne: { lat: number; lng: number };
  _sw: { lat: number; lng: number };
}) => {
  return {
    maxLatitude: bounds._ne.lat,
    minLatitude: bounds._sw.lat,
    maxLongitude: bounds._ne.lng,
    minLongitude: bounds._sw.lng,
  };
};

type MapGLProps = {
  searchCoordinates: { lat: number; lng: number };
  oldPoints: Array<PlaceProps>;
  setBounds: React.Dispatch<
    React.SetStateAction<{
      maxLatitude: number;
      minLatitude: number;
      maxLongitude: number;
      minLongitude: number;
    }>
  >;
};

const MapGL: FC<MapGLProps> = ({ searchCoordinates, setBounds, oldPoints }) => {
  const router = useRouter();
  const [timeLimitation, setTimeLimitation] = useState<[number, number]>([
    0,
    new Date().getTime(),
  ]);
  const mapRef = useRef<any>(null);
  const paths = usePathsQuery();
  const [openPlace, setOpenPlace] = useState<number | null>(null);
  const [placeMinimized, setPlaceMinimized] = useState<boolean>(true);

  const [viewport, setViewport] = useState<Viewport>({
    latitude: 50,
    longitude: 15,
    zoom: 3.5,
    bearing: 0,
    pitch: 0,
  });

  const pathColors = [
    '#00ff95',
    '#ed315d',
    '#43bccd',
    '#ffb647',
    '#555eb4',
    '#ff5964',
    '#a572d5',
  ];

  // when search result changes move to search result coordinates
  useEffect(() => {
    setViewport({
      ...viewport,
      longitude: searchCoordinates.lng,
      latitude: searchCoordinates.lat,
      zoom: 14,
      // @ts-ignore
      transitionDuration: 5000,
      transitionInterpolator: new FlyToInterpolator(),
    });
  }, [searchCoordinates]);

  // on load change map viewport coordinates according to url parameter
  useEffect(() => {
    setViewport({
      ...viewport,
      // @ts-ignore
      longitude: parseFloat(router.query?.lng ?? 15),
      // @ts-ignore
      latitude: parseFloat(router.query?.lat ?? 50),
      // @ts-ignore
      zoom: parseFloat(router.query?.zoom ?? 14),
      // @ts-ignore
      transitionDuration: 500,
      transitionInterpolator: new FlyToInterpolator(),
    });
    // @ts-ignore
    setOpenPlace(router.query?.place ? parseInt(router.query?.place) : null);
  }, []);

  // update place in url query params when changed
  useEffect(
    () => UpdateUrl({ ...viewport, router, place: openPlace }),
    [openPlace]
  );

  // PLACES FILTER
  /*
   * filters `posts` in `places` by timeline requirements
   * returns only `places` that has at least one `post`
   */
  const filteredPlaces =
    oldPoints.length > 0
      ? oldPoints.reduce((filtered: PlaceProps[], original: PlaceProps) => {
          const posts = original.posts.filter((post: { postDate: number }) => {
            const postYear = new Date(post.postDate).getFullYear();
            return (
              timeLimitation[0] <= postYear && postYear <= timeLimitation[1]
            );
          });
          if (posts.length > 0) filtered.push({ ...original, posts });
          return filtered;
        }, [])
      : [];

  // convert points to geoJSON format
  const points = filteredPlaces.map((place: PlaceProps) => ({
    type: 'Feature',
    properties: {
      cluster: false,
      id: place.id,
      category: 'place',
    },
    geometry: {
      type: 'Point',
      coordinates: [place.longitude, place.latitude],
    },
  }));

  // generate clusters from points
  const { clusters, supercluster } = useSuperCluster({
    points: points,
    zoom: viewport.zoom,
    bounds: mapRef.current
      ? mapRef.current.getMap().getBounds().toArray().flat()
      : null,
    options: { radius: 75, maxZoom: 20 },
  });

  if (paths.loading) return <div>loading</div>;
  if (paths.error) return <div>error...</div>;

  const Paths = paths.data!.paths!.map((path: any, index: number) => {
    return (
      <Source
        key={index}
        id={index.toString()}
        type="geojson"
        data={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: JSON.parse(path!.coordinates.replace(/\n/g, '')),
          },
          properties: {
            id: index,
            name: path?.name,
          },
        }}
      >
        <Layer
          {...{
            id: index.toString(),
            type: 'line',
            paint: {
              'line-color': pathColors[index % pathColors.length],
            },
          }}
        />
      </Source>
    );
  });

  return (
    <>
      <div className="flex w-full h-full">
        {openPlace && (
          <div className={`relative ${placeMinimized ? 'w-0' : 'w-[50%]'}`}>
            <PlaceWindow
              id={openPlace}
              setOpenPlace={setOpenPlace}
              setViewport={setViewport}
              viewport={viewport}
            />
            <button
              className="absolute z-20 py-4 pl-2 bg-white rounded-l -right-6 top-1/2 -translate-y-1/2 rounded-xl shadow-custom"
              onClick={() => setPlaceMinimized(!placeMinimized)}
            >
              <ChevronIcon
                className={`h-6 w-6 ${
                  placeMinimized ? 'rotate-90' : '-rotate-90'
                }`}
                stroke="#3C4043"
              />
            </button>
          </div>
        )}
        <ReactMapGL
          {...viewport}
          width={placeMinimized ? '100%' : '50%'}
          height="100%"
          onViewportChange={setViewport}
          mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          dragRotate={false}
          ref={(instance) => (mapRef.current = instance)}
          onLoad={(event) => {
            if (mapRef.current) setBounds(mapRef.current.getMap().getBounds());
          }}
          onInteractionStateChange={async (s: any) => {
            // when map state changes (dragging, zooming, rotating, etc.)
            if (!s.isDragging && mapRef.current)
              setBounds(GetBounds(mapRef.current.getMap().getBounds()));

            // if there is no interaction with map update lat, lng... props in url
            if (
              !(
                s.isDragging ||
                s.inTransition ||
                s.isRotating ||
                s.isZooming ||
                s.isHovering ||
                s.isPanning
              )
            )
              UpdateUrl({ ...viewport, router, place: openPlace });
          }}
        >
          <GeolocateControl
            style={{
              bottom: 186,
              right: 0,
              padding: '10px',
            }}
            positionOptions={{ enableHighAccuracy: true }}
          />
          <NavigationControl
            style={{
              bottom: 240,
              right: 0,
              padding: '10px',
            }}
            showCompass={false}
          />

          {clusters.map((cluster) => {
            const [longitude, latitude] = cluster.geometry.coordinates;
            const { cluster: isCluster, point_count: pointCount } =
              cluster.properties;

            if (isCluster) {
              return (
                <Marker
                  key={`cluster-${cluster.id}`}
                  latitude={latitude}
                  longitude={longitude}
                >
                  <div
                    className="w-20 h-20 text-center text-white bg-red-500 rounded-full py-[2em]"
                    onClick={() => {
                      const expansionZoom = Math.min(
                        supercluster.getClusterExpansionZoom(cluster.id),
                        20
                      );

                      setViewport({
                        ...viewport,
                        latitude,
                        longitude,
                        zoom: expansionZoom,
                      });
                    }}
                  >
                    {pointCount}
                  </div>
                </Marker>
              );
            }
            const place = filteredPlaces.find(
              (place: PlaceProps) =>
                place.latitude === latitude && place.longitude === longitude
            );
            return place ? (
              <MapPlace
                key={cluster.id}
                place={place}
                onClick={() => {
                  setOpenPlace(place.id);
                  setPlaceMinimized(false);
                }}
              />
            ) : null;
          })}
        </ReactMapGL>
        {openPlace === null && (
          <div className="absolute z-50 left-[10vw] top-20 w-[80vw]">
            <TimeLine
              domain={[1000, new Date().getFullYear()]}
              setTimeLimitation={setTimeLimitation}
            />
          </div>
        )}
      </div>
    </>
  );
};

const MapPlace = ({ place, onClick }: { place: any; onClick: () => void }) => {
  return (
    <Marker latitude={place.latitude} longitude={place.longitude}>
      <div
        onClick={onClick}
        className="cursor-pointer -translate-y-1/2 -translate-x-1/2"
      >
        <Image
          src={place.icon ?? place.posts[0].url[0]}
          width={60}
          height={60}
          className="object-cover rounded-full"
          alt="Picture on map"
        />
      </div>
    </Marker>
  );
};

type PlaceWindowProps = {
  id: number;
  setOpenPlace: React.Dispatch<number | null>;
  setViewport: (value: React.SetStateAction<Viewport>) => void;
  viewport: Viewport;
};

// side window with place details
const PlaceWindow: React.FC<PlaceWindowProps> = ({
  id,
  setOpenPlace,
  setViewport,
  viewport,
}) => {
  const { data, loading, error } = usePlaceQuery({ variables: { id } });
  const isLoggedQuery = useIsLoggedQuery();

  if (loading || isLoggedQuery.loading)
    return (
      <div className="relative z-30 w-full h-full bg-white"> loading </div>
    );
  if (error || isLoggedQuery.error || data?.place === undefined)
    return <div className="w-full h-full"> error </div>;

  console.log(data);

  return (
    <>
      <div className="relative z-30 w-full h-full overflow-y-auto bg-white">
        {/* BANNER */}
        <div className="w-full bg-green-700 h-80">
          {/* @ts-ignore */}
          {data.place.posts[0]?.url[0] && (
            <>
              {' '}
              <div className="relative w-full h-full">
                <Image
                  // BANNER IMAGE
                  src={
                    data.place.preview.length > 0
                      ? data.place.preview
                      : data.place.posts[0].url[0]
                  }
                  layout="fill"
                  alt="Place preview"
                  objectFit="cover"
                />
              </div>
            </>
          )}
        </div>
        <h2 id="PLACE_NAME" className="px-2 pt-1 text-2xl font-semibold">
          {data.place.name.length > 0 ? data.place.name : 'Place on map'}
        </h2>
        <div className="px-2 pt-1 pb-2 mb-2 border-b border-[#E6EAEC]">
          <span
            id="SHOW_ON_MAP"
            className="flex items-center text-sm cursor-pointer text-[#1872E9]"
            onClick={() => {
              setViewport({
                ...viewport,
                longitude: data.place.longitude,
                latitude: data.place.latitude,
                zoom: 14,
                // @ts-ignore
                transitionDuration: 500,
                transitionInterpolator: new FlyToInterpolator(),
              });
            }}
          >
            <MarkerIcon className="w-6 h-6" fill="#1872E9" />
            Show place on map
          </span>
          <h3 id="NUMBER_OF_POSTS" className="px-2 text-[#1872E9]">
            {data.place.posts.length} posts
          </h3>
        </div>

        <p id="DESCRIPTION" className="px-2 pb-2">
          {data.place.description.length > 0
            ? data.place.description
            : "This place doesn't have any description yet, if you want to add description please contact admin"}
        </p>
        <div className="flex w-full my-2">
          {/* createPost link with place coordinates in query params */}
          <Link
            href={{
              pathname: 'createPost',
              query: { lat: data.place.latitude, lng: data.place.longitude },
            }}
          >
            <a className="flex px-3 py-1 m-auto font-semibold border rounded-full border-[#DADDE1] text-[#3C4043]">
              <CameraIcon className="w-6 h-6 mr-1" stroke="#1872E9" />
              Add photo of this place
            </a>
          </Link>
        </div>
        <Carousel
          // @ts-ignore
          items={data.place.nearbyPlaces.map((place) => ({
            ...place,
            // @ts-ignore
            onClick: () => setOpenPlace(place.id),
          }))}
        />
        <div className="w-full p-2 grid grid-cols-2 gap-2">
          {
            // @ts-ignore
            data.place.posts.map((post) => (
              <MinimalPostCard
                isLoggedQuery={isLoggedQuery}
                id={post!.id}
                key={post!.id}
              />
            ))
          }
        </div>
      </div>
    </>
  );
};

type CarouselProps = {
  items: Array<{
    preview: string;
    distance: number;
    url: string;
    name: string;
    description: string;
    onClick: () => void;
  }>;
};
const Carousel: React.FC<CarouselProps> = ({ items }) => {
  const [itemNumber, setItemNumber] = useState(0);

  return (
    <div className="relative w-full h-80">
      <div className="relative flex w-full overflow-x-auto h-72">
        {items.map((item, index) => (
          <img
            onClick={item.onClick}
            key={index}
            src={item.preview}
            className="block object-cover h-auto p-1 w-[14rem] rounded-2xl"
            alt="Place preview"
          />
        ))}
      </div>
    </div>
  );
};

const MinimalPostCard: FC<{
  isLoggedQuery: any;
  id: number;
}> = ({ id, isLoggedQuery }) => {
  const router = useRouter();

  const { data, loading, error } = usePostQuery({ variables: { id } });
  const [unfollowMutation] = useUnfollowMutation();

  const [deleteMutation] = useDeleteMutation();

  const [modal, setModal] = useState(false);
  const [modalScreen, setModalScreen] = useState('main');
  const modalProps = {
    open: modal,
    onClose: () => {
      setModal(false);
      setModalScreen('main');
    },
  };

  const [currentImage, setCurrentImage] = useState(0);
  const [editMode, setEditMode] = useState(false);

  if (loading) return <div>loading</div>;
  if (error || data?.post.liked === undefined) {
    console.log(error);

    return <div>error</div>;
  }

  const postDate = new Date(data!.post.postDate).toLocaleDateString('cs-cz', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <>
      {modalScreen === 'main' ? (
        <Modal {...modalProps} aria-labelledby="modal-title">
          {isLoggedQuery?.data?.isLogged?.id === data!.post.author.id ? (
            <>
              <ModalOption
                onClick={async () => {
                  try {
                    await deleteMutation({
                      variables: { id },
                    });
                  } catch (error) {
                    // @ts-ignore
                    toast.error(error.message);
                  }
                }}
                text="Delete post"
                warning
              />
              <ModalOption
                onClick={() => {
                  setEditMode(true);
                  setModalScreen('report');
                }}
                text="Edit"
              />
            </>
          ) : (
            isLoggedQuery?.data?.isLogged?.id && (
              <>
                <ModalOption
                  onClick={() => setModalScreen('report')}
                  text="Report"
                  warning
                />

                <ModalOption
                  onClick={async () => {
                    try {
                      await unfollowMutation({
                        variables: { userID: data!.post.author.id },
                      });
                    } catch (error) {
                      // @ts-ignore
                      toast.error(error.message);
                    }
                  }}
                  text="Unfollow"
                  warning
                />
              </>
            )
          )}
          <ModalOption onClick={() => setModal(false)} text="Share" />
          <ModalOption
            onClick={() =>
              router.push(`https://www.histories.cc/post/${data?.post.id}`)
            }
            text="Go to post"
          />
          <ModalOption
            onClick={async () => {
              await navigator.clipboard.writeText(
                `https://www.histories.cc/post/${data?.post.id}`
              );
              modalProps.onClose();
            }}
            text="Copy link"
          />
          <ModalOption onClick={() => setModal(false)} text="Cancel" />
        </Modal>
      ) : modalScreen === 'report' ? (
        <Modal aria-labelledby="modal-title" {...modalProps}>
          <div className="relative w-full py-4 border-b border-[#DADBDA]">
            <a className="text-center">Report</a>
            <button
              className="absolute text-3xl font-semibold top-1 right-4"
              onClick={modalProps.onClose}
            >
              x
            </button>
          </div>
          <ModalOption onClick={() => setModal(false)} text="Reason 1" />
          <ModalOption onClick={() => setModal(false)} text="Reason 2" />
          <ModalOption onClick={() => setModal(false)} text="Reason 3" />
          <ModalOption onClick={() => setModal(false)} text="Reason 4" />
        </Modal>
      ) : (
        <></>
      )}

      <div className="w-full m-auto mb-8 bg-white border rounded-lg dark:bg-[#343233] border-gray-[#DADBDA] text-text-light dark:text-white">
        <div className="flex w-full space-between p-[1em]">
          <a className="flex items-center w-full gap-[10px] h-18">
            <Link href={`/${data!.post.author.username}`}>
              <>
                <Avatar
                  size="medium"
                  src={GeneratedProfileUrl(
                    data!.post.author.firstName,
                    data!.post.author.lastName
                  )}
                />
                <div>
                  <a className="text-lg font-semibold">
                    {data!.post.author.firstName} {data!.post.author.lastName}
                  </a>
                  <a className="flex gap-[10px]">
                    <TimeAgo date={data.post.createdAt} />
                  </a>
                </div>
              </>
            </Link>
          </a>
          <p className="p-3 w-[200px]">
            <a className="flex mt-2 gap-[10px]">
              <MdPhotoCamera size={24} />
              {postDate}
            </a>
          </p>
        </div>
        {data.post.description}

        <div className="w-full">
          <img src={data.post.url[currentImage]} alt="Post" />
        </div>
      </div>
    </>
  );
};

const ModalOption = ({
  text,
  onClick,
  warning,
}: {
  text: string;
  onClick: () => void;
  warning?: boolean;
}) => {
  const [loading, setLoading] = useState(false);

  return (
    <button
      onClick={onClick}
      className={`${
        warning ? 'text-red-500 font-semibold' : ''
      } w-full border-b border-gray-[#DADBDA] py-4`}
    >
      {loading ? 'loading...' : text}
    </button>
  );
};

export default MapGL;
