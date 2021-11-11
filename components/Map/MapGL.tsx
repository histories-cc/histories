import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import ReactMapGL, {
  Marker,
  NavigationControl,
  GeolocateControl,
  Source,
  FlyToInterpolator,
  Layer,
} from 'react-map-gl';
import { usePathsQuery, usePlaceQuery } from '@graphql/geo.graphql';
import Image from 'next/image';
import useSuperCluster from 'use-supercluster';
import Gallery from 'react-photo-gallery';
import { Button } from '@nextui-org/react';
import GeneratedProfileUrl from '@lib/functions/GeneratedProfileUrl';
import { useCreateCommentMutation, usePostQuery } from '@graphql/post.graphql';
import TimeAgo from 'react-timeago';
import { Comment } from '@components/Comment';
import { DotsHorizontalIcon } from '@heroicons/react/solid';
import {
  ChatIcon,
  PaperAirplaneIcon,
  BookmarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/outline';
import { useIsLoggedQuery } from '@graphql/user.graphql';
import { Modal, Menu } from '@components/Modal';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import { TimeLine } from '@components/TimeLine';
import {
  useLikeMutation,
  useReportMutation,
  useUnlikeMutation,
} from '@graphql/relations.graphql';
import UpdateUrl from './UpdateUrl';
import { motion } from 'framer-motion';
import { PostCard } from '@components/PostCard';
import image from 'next/image';
import Link from 'next/link';
import { Viewport } from '@lib/types/viewport';
import { StringValueNode } from 'graphql';
import CameraIcon from '@components/Icons/CameraIcon';
import ShareIcon from '@components/Icons/ShareIcon';
import MarkerIcon from '@components/Icons/MarkerIcon';
import ChevronIcon from '@components/Icons/Chevron';

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
  const paths = usePathsQuery();
  const [openPlace, setOpenPlace] = useState<number | null>(null);
  const [placeMinimized, setPlaceMinimized] = useState<boolean>(false);

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

  const mapRef = useRef<any>(null);

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
      <div className="w-full h-full flex">
        {openPlace && (
          <div className={`relative ${placeMinimized ? 'w-0' : 'w-[50%]'}`}>
            <PlaceWindow
              id={openPlace}
              setOpenPlace={setOpenPlace}
              setViewport={setViewport}
              viewport={viewport}
            />
            <button
              className="absolute -right-6 top-1/2 -translate-y-1/2 z-20 py-4 pl-2 bg-white rounded-l rounded-xl shadow-custom"
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
                    className="text-white bg-red-500 h-20 w-20 rounded-full py-[2em] text-center "
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
          <div className="absolute left-[10vw] top-20 z-50 w-[80vw]">
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
        className="-translate-y-1/2 -translate-x-1/2 cursor-pointer"
      >
        <Image
          src={place.posts[0].url[0]}
          width={60}
          height={60}
          className="rounded-full object-cover"
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
    return <div className="w-full h-full"> loading </div>;
  if (error || isLoggedQuery.error || data?.place === undefined)
    return <div className="w-full h-full"> error </div>;

  console.log(data);

  return (
    <>
      <div className="relative z-30 w-full h-full overflow-y-auto">
        {/* BANNER */}
        <div className="w-full h-80 bg-green-700">
          {/* @ts-ignore */}
          {data.place.posts[0]?.url[0] && (
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
          )}
        </div>
        <h2 id="PLACE_NAME" className="font-semibold text-2xl px-2 pt-1">
          {data.place.name.length > 0 ? data.place.name : 'Place on map'}
        </h2>
        <div className="border-b border-[#E6EAEC] px-2 pb-2 pt-1 mb-2">
          <span
            id="SHOW_ON_MAP"
            className="text-sm text-[#1872E9] flex items-center cursor-pointer"
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
            <MarkerIcon className="h-6 w-6" fill="#1872E9" />
            Show place on map
          </span>
          <h3 id="NUMBER_OF_POSTS" className="text-[#1872E9] px-2">
            {data.place.posts.length} posts
          </h3>
        </div>

        <p id="DESCRIPTION" className="px-2 pb-2">
          {data.place.description.length > 0
            ? data.place.description
            : "This place doesn't have any description yet, if you want to add description please contact admin"}
        </p>
        <div className="w-full flex my-2">
          {/* createPost link with place coordinates in query params */}
          <Link
            href={{
              pathname: 'createPost',
              query: { lat: data.place.latitude, lng: data.place.longitude },
            }}
          >
            <a className="m-auto py-1 px-3 rounded-full flex border border-[#DADDE1] text-[#3C4043] font-semibold">
              <CameraIcon className="h-6 w-6 mr-1" stroke="#1872E9" />
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
        <div>
          {
            // @ts-ignore
            data.place.posts.map((post) => (
              <PostCard
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
      <div className="w-full h-72 flex overflow-x-auto relative">
        {items.map((item, index) => (
          <img
            onClick={item.onClick}
            key={index}
            src={item.preview}
            className="block w-[14rem] h-auto object-cover p-1 rounded-2xl"
            alt="Place preview"
          />
        ))}
      </div>
    </div>
  );
};

export default MapGL;
