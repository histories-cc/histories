import Main from '@components/layouts/Main';
import MapTemplate from '@components/templates/MapTemplate';
import { GetServerSideProps } from 'next';
import React from 'react';

import { Maybe } from '../../.cache/__types__';

export type SidebarPlaceType = {
  id: number;
  name?: string | null;
  longitude: number;
  latitude: number;
  icon?: string | null;
  preview?: Maybe<{
    hash: string;
    blurhash: string;
    width: number;
    height: number;
  }>;
  description?: Maybe<string>;
};

const MapPage: React.FC<{
  lat: number | null;
  lng: number | null;
  zoom: number | null;
  minYear: number | null;
  maxYear: number | null;
  place: number | null;
}> = (props) => {
  return (
    <Main
      head={{
        title: `Map | HiStories`,
        description: `HiStorical map of the world with stories and timeline`,
        canonical: 'https://www.histories.cc/',
        openGraph: {
          title: `Map | HiStories`,
          type: 'website',
          url: 'https://www.histories.cc/',
          description: `HiStorical map of the world with stories and timeline`,
          site_name: 'Map',
        },
      }}
    >
      <MapTemplate {...props} />
    </Main>
  );
};

// get parameters from url
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (ctx.req.url?.startsWith('_next')) return { props: {} }; // for nextjs

  const { lat, lng, zoom, maxYear, minYear, place } = ctx.query;
  // check if values are valid
  return {
    props: {
      lat: typeof lat === 'string' ? parseFloat(lat) : null,
      lng: typeof lng === 'string' ? parseFloat(lng) : null,
      zoom: typeof zoom === 'string' ? parseFloat(zoom) : null,
      place: typeof place === 'string' ? parseFloat(place) : null,
      minYear: typeof minYear === 'string' ? parseFloat(minYear) : null,
      maxYear: typeof maxYear === 'string' ? parseFloat(maxYear) : null,
    },
  };
};

export default MapPage;
