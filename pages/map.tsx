import {
  defaultValues,
  MapContext,
} from '@components/Templates/Map/MapContext';
import MapGL from '@components/Templates/Map/MapWindow';
import RightPanel from '@components/Templates/Map/RightPanel/RightPanel';
import { usePlacesQuery } from '@graphql/geo.graphql';
import { usePostsQuery } from '@graphql/post.graphql';
import Viewport from '@lib/types/viewport';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

import { Maybe } from '../.cache/__types__';
import ArrowIcon from '../components/Elements/Icons/ArrowIcon';
import { Layout } from '../components/Layouts';
import { TimeLine } from '../components/Modules/TimeLine';

export type SidebarPlaceType = {
  id: number;
  name?: string | null;
  longitude: number;
  latitude: number;
  icon?: string | null;
  preview?: {
    hash: string
    blurhash: string
    width: number
    height: number
  }
  description?: Maybe<string>;
};

const Map: React.FC = () => {
  const [bounds, setBounds] = useState(defaultValues.bounds);
  const placesQuery = usePlacesQuery({
    variables: {
      input: {
        filter: { take: 1 },
      },
    },
  });

  const postsQuery = usePostsQuery({
    variables: {
      input: {
        filter: { take: 1 },
      },
    },
  });

  async function FetchMore() {
    if (placesQuery.loading || postsQuery.loading) return;

    // fetch more data when map view changes
    if (whatToShow === 'photos')
      await postsQuery.refetch({
        input: {
          filter: bounds,
        },
      });
    else
      await placesQuery.fetchMore({
        variables: {
          input: {
            filter: {
              ...bounds,
              // exclude just places in bounds
              exclude: placesQuery.data?.places
                ? placesQuery.data.places
                  .filter(
                    (place) =>
                      place.latitude > bounds.minLatitude &&
                      place.latitude < bounds.maxLatitude &&
                      place.longitude > bounds.minLongitude &&
                      place.longitude < bounds.maxLongitude &&
                      placesQuery.data?.places.filter(
                        (x) => x.id === place.id
                      )
                  )
                  .map((place) => place.id)
                : [],
            },
          },
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          return {
            ...previousResult,
            // Add the new matches data to the end of the old matches data.
            places: [
              ...previousResult.places,
              ...(fetchMoreResult?.places ?? []),
            ],
          };
        },
      });
  }
  const [hoverPlaceId, setHoverPlaceId] = useState<number | null>(null);
  const [whatToShow, setWhatToShow] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [timeLimitation, setTimeLimitation] = useState<[number, number]>([
    1000,
    new Date().getTime(),
  ]);

  const [sidebarPlace, setSidebarPlace] =
    useState<Maybe<SidebarPlaceType>>(null);

  // map viewport
  const [viewport, setViewport] = useState<Viewport>(defaultValues.viewport);

  useEffect(() => {
    FetchMore();
  }, [whatToShow]);

  return (
    <Layout
      head={{
        title: `Map | HiStories`,
        description: `HiStorical map of the world with stories and timeline`,
        canonical: 'https://www.histories.cc/map',
        openGraph: {
          title: `Map | HiStories`,
          type: 'website',
          url: 'https://www.histories.cc/map',
          description: `HiStorical map of the world with stories and timeline`,
          site_name: 'Map',
        },
      }}
    >
      <MapContext.Provider
        value={{
          bounds,
          setBounds,
          whatToShow,
          setWhatToShow,
          viewport,
          setViewport,
          sidebarPlace,
          setSidebarPlace,
          timeLimitation,
          setTimeLimitation,
          placesQuery,
          postsQuery,
          hoverPlaceId,
          setHoverPlaceId,
          showSidebar,
          setShowSidebar,
        }}
      >
        <div className="w-full bg-[#FAFBFB] dark:bg-[#171716]">
          <AnimatePresence>
            <motion.section
              className="w-full grid"
              initial={{
                gridTemplateColumns: '1fr 1fr',
              }}
              animate={{
                gridTemplateColumns: showSidebar ? '1fr 1fr' : '1fr 0fr',
              }}
              transition={{
                delay: !showSidebar ? 0 : 0.5,
                duration: 0.25,
                ease: 'easeInOut',
              }}
              style={{
                height: 'calc(100vh - 56px)',
              }}
            >
              <div className="relative w-full p-2 col-span-1">
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="absolute z-50 flex items-center h-8 py-1 text-gray-500 bg-white border border-gray-200 top-4 right-4 hover:text-black hover:border-gray-400 rounded-xl"
                >
                  <motion.span
                    animate={{ rotate: showSidebar ? '180deg' : '0deg' }}
                    transition={{
                      delay: 0.3,
                      duration: 0.2,
                      ease: 'easeInOut',
                    }}
                  >
                    <ArrowIcon className={'w-8 py-1 h-8'} />
                  </motion.span>
                </button>
                <div className="absolute right-0 z-20 px-8 pt-2 w-[28vw]">
                  <TimeLine domain={[1000, new Date().getFullYear()]} />
                </div>
                <MapGL
                  onMove={async (bounds) => {
                    setBounds(bounds);
                    FetchMore();
                  }}
                />
              </div>
              <RightPanel />
            </motion.section>
          </AnimatePresence>
        </div>
      </MapContext.Provider>
    </Layout>
  );
};

export default Map;
