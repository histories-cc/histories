import MapPageGrid from '@components/modules/mapPage/Grid';
import { useMapPlacesQuery } from '@graphql';
import { usePostsQuery } from '@graphql';
import {
  boundsPlaceholder,
  viewportPlaceholder,
} from '@src/constants/MapPlaceholderValues';
import { MapContext } from '@src/contexts/MapContext';
import { IViewport } from '@src/types/map';
import React, { useEffect, useState } from 'react';

import { minYearConstant } from '../../../shared/constants/constants';
export interface IMapUrlQueryParams {
  lat: number | null;
  lng: number | null;
  zoom: number | null;
  minYear: number | null;
  maxYear: number | null;
  place: number | null;
}

const MapTemplate: React.FC<IMapUrlQueryParams> = ({
  lat,
  lng,
  zoom,
  minYear,
  maxYear,
  place,
}) => {
  const [bounds, setBounds] = useState(boundsPlaceholder); // viewport bounds

  const placesQuery = useMapPlacesQuery({
    variables: {
      input: {
        filter: { take: 25 },
      },
    },
  }); // places query

  const postsQuery = usePostsQuery({
    variables: {
      input: {
        filter: { take: 1 },
      },
    },
  }); // posts query

  const [hoverPlaceId, setHoverPlaceId] = useState<number | null>(null); // place id on hover
  const [whatToShow, setWhatToShow] = useState<'places' | 'photos'>('places'); // what to show on the right panel
  const [showSidebar, setShowSidebar] = useState<boolean>(true); // is sidebar visible
  const [timeLimitation, setTimeLimitation] = useState<[number, number]>([
    minYear ?? minYearConstant,
    maxYear ?? new Date().getFullYear(),
  ]);

  const [sidebarPlace, setSidebarPlace] = useState<number | null>(place);

  // map viewport
  const [viewport, setViewport] = useState<IViewport>({
    ...viewportPlaceholder,
    latitude: lat || viewportPlaceholder.latitude,
    longitude: lng || viewportPlaceholder.longitude,
    zoom: zoom || viewportPlaceholder.zoom,
  });

  // if there isn't coordinates in url query, use client coordinates
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      if (lat !== null || lng !== null) return;

      setViewport({
        ...viewport,
        latitude: position.coords.latitude || viewportPlaceholder.latitude,
        longitude: position.coords.longitude || viewportPlaceholder.longitude,
        zoom: 14,
      });
    });
  }, []);

  return (
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
      <MapPageGrid />
    </MapContext.Provider>
  );
};

export default MapTemplate;
