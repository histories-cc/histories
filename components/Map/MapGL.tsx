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
          <div className="w-[50%]">
            <PlaceWindow
              id={openPlace}
              setOpenPlace={setOpenPlace}
              setViewport={setViewport}
              viewport={viewport}
            />
          </div>
        )}
        <ReactMapGL
          {...viewport}
          width={openPlace ? '50%' : '100%'}
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
                onClick={() => setOpenPlace(place.id)}
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
      {/* marker appear and disappear animation */}
      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.4, opacity: 0 }}
        transition={{
          ease: 'easeOut',
          duration: 0.2,
        }}
        onClick={onClick}
      >
        <Image
          src={place.posts[0].url[0]}
          width={60}
          height={60}
          className="rounded-full w-12 h-12 object-cover"
          alt="Picture on map"
        />
      </motion.div>
    </Marker>
  );
};

type PlaceModalProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  place: any;
};

const PlaceModal: React.FC<PlaceModalProps> = ({
  isOpen,
  setIsOpen,
  place,
}) => {
  const photos = place.posts.map((photo: { url: string[] }) => ({
    src: photo.url[0],
    width: 4,
    height: 3,
  }));
  const [detail, setDetail] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const openLightbox = useCallback((event, { photo, index }) => {
    setCurrentImage(index);
    setDetail(true);
    setIsOpen(false);
  }, []);

  return (
    <>
      <motion.section
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.4, opacity: 0 }}
        transition={{
          ease: 'easeOut',
          duration: 0.2,
        }}
      >
        <Modal
          open={isOpen}
          onClose={() => {
            setDetail(false);
            setIsOpen(false);
          }}
        >
          <section className="absolute justify-between z-50 top-[50%] left-[50%] bg-white max-h-[600px] max-w-[800px] w-full h-full -translate-y-1/2 -translate-x-1/2 rounded-xl">
            <Gallery photos={photos} onClick={openLightbox} />
          </section>
        </Modal>
      </motion.section>
      <DetailModal
        open={detail}
        onClose={() => {
          setIsOpen(true);
          setDetail(false);
        }}
        place={place}
        currentImage={currentImage}
        setCurrentImage={setCurrentImage}
      />{' '}
    </>
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
    <div className="w-full h-full overflow-y-auto">
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
      {/* HEADER */}
      <h2 className="font-semibold text-3xl">
        {data.place.name.length > 0 ? data.place.name : 'Place on map'}
      </h2>
      {data.place.preview}
      {/* DETAILS */}
      <h3 className="">{data.place.posts.length} posts</h3>
      {/* SHOW LOCATION ON MAP */}
      <button
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
        show location on map
      </button>
      <br />
      <button onClick={() => setOpenPlace(null)}>close</button>
      <br />
      {/* createPost link with place coordinates in query params */}
      <Link
        href={{
          pathname: 'createPost',
          query: { lat: data.place.latitude, lng: data.place.longitude },
        }}
      >
        <a className="text-blue-500">add post to this place</a>
      </Link>
      <p>
        {data.place.description.length > 0
          ? data.place.description
          : "This place doesn't have any description yet, if you want to add description please contact admin"}
      </p>
      adssadas
      <Carousel
        // @ts-ignore
        items={data.place.nearbyPlaces.map((place) => ({
          ...place,
          // @ts-ignore
          onClick: () => setOpenPlace(place.id),
        }))}
      />
      adssadas
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

const DetailModal: React.FC<{
  onClose: () => void;
  place: any;
  open: boolean;
  currentImage: number;
  setCurrentImage: React.Dispatch<React.SetStateAction<number>>;
}> = ({ onClose, place, open, currentImage, setCurrentImage }) => {
  const [imageInSequence, setImageInSequence] = useState(0);
  const { data, loading, error, refetch } = usePostQuery({
    variables: { id: place.posts[currentImage].id },
  });
  const [likeMutation] = useLikeMutation();
  const [unlikeMutation] = useUnlikeMutation();
  const [reportMutation] = useReportMutation();
  const isLogged = useIsLoggedQuery();
  const [commentContent, setCommentContent] = useState('');
  const [createCommentMutation] = useCreateCommentMutation();

  if (loading || isLogged.loading) return <div>loading</div>;
  if (error || isLogged.error) return <div>error</div>;

  return (
    <Modal onClose={onClose} open={open}>
      <section className="absolute justify-between z-50 top-[50%] left-[50%] bg-white max-h-[600px] max-w-[800px] w-full h-full -translate-y-1/2 -translate-x-1/2 rounded-xl flex">
        {/* NAVIGATION IN PLACE PHOTOS */}
        {currentImage > 0 && (
          <button onClick={() => setCurrentImage(currentImage - 1)}>
            <ChevronLeftIcon className="h-10 w-10 absolute z-50 top-[50%] -left-20 -translate-y-1/2 text-white" />
          </button>
        )}
        {currentImage < place.posts.length - 1 && (
          <button onClick={() => setCurrentImage(currentImage + 1)}>
            <ChevronRightIcon className="h-10 w-10 absolute z-50 top-[50%] -right-20 -translate-y-1/2 text-white" />
          </button>
        )}

        {/* PHOTO */}
        <div className="relative max-h-[600px] max-w-[480px] w-full h-full ">
          {/* NAVIGATION IN COLLECTION */}
          {place.posts[currentImage].url.length > 1 && (
            <>
              {imageInSequence > 0 && (
                <button onClick={() => setImageInSequence(imageInSequence - 1)}>
                  <ChevronLeftIcon className="h-8 w-8 absolute z-50 top-[50%] left-0 -translate-y-1/2 text-white" />
                </button>
              )}
              {imageInSequence < place.posts[currentImage].url.length - 1 && (
                <button onClick={() => setImageInSequence(imageInSequence + 1)}>
                  <ChevronRightIcon className="h-8 w-8 absolute z-50 top-[50%] right-0 -translate-y-1/2 text-white" />
                </button>
              )}
            </>
          )}
          <Image
            src={place.posts[currentImage].url[imageInSequence]}
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            alt="Post"
            className="rounded-l-xl"
          />
        </div>
        <div className="flex-auto h-full">
          {/* POST DETAILS */}
          <div className="w-full justify-between flex p-3 border-b border-[#EEEFEE]">
            <div className="flex items-center gap-2">
              <div className="relative rounded-full w-8 h-8">
                <Image
                  src={GeneratedProfileUrl(
                    place.posts[currentImage].author.firstName,
                    place.posts[currentImage].author.lastName
                  )}
                  layout="fill"
                  objectFit="contain"
                  objectPosition="center"
                  className="rounded-full"
                  alt="Profile picture"
                />
              </div>
              {`${place.posts[currentImage].author.firstName} ${place.posts[currentImage].author.lastName}`}
            </div>
            <Menu
              items={[
                {
                  title: 'Report',
                  onClick: async () => {
                    try {
                      await reportMutation({
                        variables: { id: place.posts[currentImage].id },
                      });
                      toast.success('Post reported');
                    } catch (error: any) {
                      toast.error(error.message);
                    }
                  },
                },
                { title: 'Unfollow', onClick: () => {} },
                {
                  title: 'Go to post',
                  href: `/post/${place.posts[currentImage].id}`,
                },
                {
                  title: 'Copy link',
                  onClick: () =>
                    navigator.clipboard.writeText(
                      `https://www.histories.cc/post/${data?.post.id}`
                    ),
                },
              ]}
            >
              <button className="">
                <DotsHorizontalIcon className="h-6 w-6" />
              </button>
            </Menu>
          </div>

          {/* COMMENTS */}
          <div id="comments" className="w-full overflow-y-auto h-[400px] pt-2">
            {data!.post.description ?? ''}
            {data!.post.comments.map((comment: any) => (
              <Comment
                content={comment.content}
                author={comment.author}
                createdAt={comment.createdAt}
                id={comment.id}
                logged={isLogged.data!.isLogged ?? null}
                key={comment.id}
                liked={comment.liked}
                refetch={refetch}
              />
            ))}
          </div>

          {/* REACTIONS */}
          <div
            id="reactions"
            className="w-full items-center gap-2 p-3 border-t border-[#EEEFEE]"
          >
            <div className="w-full flex gap-2">
              {isLogged.data?.isLogged ? (
                data?.post.liked ? (
                  <div
                    onClick={async () => {
                      try {
                        await unlikeMutation({
                          variables: { id: data!.post.id },
                        });
                        await refetch();
                      } catch (error) {
                        // @ts-ignore
                        toast.error(error.message);
                      }
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      viewBox="0 0 20 20"
                      fill="#FF0000"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                ) : (
                  <div
                    onClick={async () => {
                      try {
                        await likeMutation({
                          variables: { id: data!.post.id, type: 'like' },
                        });
                        await refetch();
                      } catch (error) {
                        // @ts-ignore
                        toast.error(error.message);
                      }
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                )
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              )}
              <ChatIcon className="h-8 w-8" />
              <PaperAirplaneIcon className="h-8 w-8 rotate-45" />
              <BookmarkIcon className="h-8 w-8 absolute right-4" />
            </div>
            <strong className="font-semibold">
              {data?.post.likes.length} likes
            </strong>
            <br />
            <TimeAgo date={data!.post.createdAt} />
          </div>
          <form
            className="w-full flex items-center gap-2 p-3 border-t border-[#EEEFEE]"
            onSubmit={async (event) => {
              event.preventDefault();

              try {
                await createCommentMutation({
                  variables: {
                    target: place.posts[currentImage].id,
                    content: commentContent,
                  },
                });
                setCommentContent('');
                await refetch();
              } catch (error: any) {
                toast.error(error.message);
              }
            }}
          >
            <textarea
              className="border-2 border-gray-300 rounded-xl bg-gray-100 p-2 resize-none overflow-hidden"
              onChange={(e: any) => setCommentContent(e.target.value)}
              value={commentContent}
              placeholder="Write a comment..."
            />
            <Button type="submit">Submit</Button>
          </form>
        </div>
      </section>
    </Modal>
  );
};

export default MapGL;
