import { ConvertBounds } from '@lib/functions';
import Viewport from '@lib/types/viewport';
import Image from 'next/image';
import React, { useRef } from 'react';
import ReactMapGL, { ExtraState, MapRef, Marker } from 'react-map-gl';
import UrlPrefix from 'shared/config/UrlPrefix';
import Bounds from 'types/Bounds';

import { Maybe } from '../../../.cache/__types__';
import { MapContext } from './MapContext';

type MapGLProps = {
  // eslint-disable-next-line no-unused-vars
  onMove?: (bounds: Bounds) => void;
};

async function OnMove(
  mapRef: React.MutableRefObject<Maybe<MapRef>>,
  // eslint-disable-next-line no-unused-vars
  onMove?: (bounds: Bounds) => void
) {
  // if onMove function is not undefined
  if (mapRef.current && onMove) {
    const bounds = ConvertBounds(mapRef.current.getMap().getBounds());
    await onMove(bounds);
  }
}

const MapGL: React.FC<MapGLProps> = ({ onMove }) => {
  const mapContext = React.useContext(MapContext);

  const mapRef = useRef<Maybe<MapRef>>(null);

  const mapProps = {
    width: '100%',
    height: '100%',
    className: 'rounded-lg',
    mapStyle: 'mapbox://styles/mapbox/streets-v11', // MAPBOX STYLE
    mapboxApiAccessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN, // MAPBOX API ACCESS TOKEN
  };

  const mapFunctions = {
    onViewportChange: (viewport: React.SetStateAction<Viewport>) =>
      mapContext.setViewport(viewport),
    // OnMove triggers
    onLoad: async () => OnMove(mapRef, onMove),
    onInteractionStateChange: async (state: ExtraState) => {
      if (!state.isDragging) OnMove(mapRef, onMove);
    },
  };

  return (
    <ReactMapGL
      {...mapContext.viewport}
      {...mapProps}
      {...mapFunctions}
      ref={(instance) => (mapRef.current = instance)}
    >
      {mapContext.placesQuery?.data?.places
        .filter((place) => (place.preview || place.icon) && place)
        .map((place) => {
          return (
            <Marker
              key={place.id}
              latitude={place.latitude}
              longitude={place.longitude}
            >
              <div className="relative">
                <div
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border-2 ${
                    place.icon ? 'w-24 h-24' : 'w-16 h-16'
                  }
                ${
                  mapContext.hoverPlaceId === place.id && !place.icon
                    ? 'border-black'
                    : 'border-transparent'
                }
                `}
                  onMouseEnter={() => mapContext.setHoverPlaceId(place.id)}
                  onMouseLeave={() => mapContext.setHoverPlaceId(null)}
                  onClick={() => mapContext.setSidebarPlace(place)}
                >
                  {place.icon ? (
                    <Image
                      src={UrlPrefix + place.icon}
                      width={90}
                      height={90}
                      objectFit="contain"
                      alt="Picture on map"
                      quality={10}
                    />
                  ) : (
                    <Image
                      // @ts-ignore
                      src={UrlPrefix + place.preview[0]}
                      layout="fill"
                      objectFit="cover"
                      objectPosition="center"
                      className="rounded-full"
                      alt="Picture on map"
                    />
                  )}
                </div>
              </div>
            </Marker>
          );
        })}
    </ReactMapGL>
  );
};

export default MapGL;
