import { Menu } from '@headlessui/react';
import { Dark, Light, Satellite } from '@src/constants/MapStyles';
import { IViewport, MapStyles } from '@src/types/map';
import React from 'react';
import { BiLayer } from 'react-icons/bi';
import ReactMapGL from 'react-map-gl';

interface IMapStyleMenu {
  viewport: IViewport;
  setMapStyle: React.Dispatch<React.SetStateAction<MapStyles>>;
}

const MapStyleMenu: React.FC<IMapStyleMenu> = ({ viewport, setMapStyle }) => {
  return (
    <Menu>
      <Menu.Button
        as="button"
        className="flex items-center bg-white border shadow-2xl rounded-md hover:bg-gray-200 border-[#C0C2CA]"
      >
        <BiLayer className="p-1 text-gray-900 w-[29px] h-[29px]" />
      </Menu.Button>
      <Menu.Items
        as="div"
        className="absolute right-0 z-50 flex flex-row p-2 bg-white border border-gray-200 rounded-lg gap-2 -mt-9 transform -translate-y-full dark:bg-gray-900 focus:outline-none dark:border-gray-800 truncated"
      >
        <Menu.Item
          as="button"
          className="block w-20 h-20 rounded"
          onClick={() => setMapStyle('light')}
        >
          <ReactMapGL
            {...{
              ...viewport,
              zoom: viewport.zoom > 4 ? viewport.zoom - 4 : viewport.zoom,
            }}
            width="100%"
            height="100%"
            className="rounded-lg"
            mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN} // MAPBOX API ACCESS TOKEN
            mapStyle={Light}
          />
        </Menu.Item>
        <Menu.Item
          as="button"
          className="block w-20 h-20"
          onClick={() => setMapStyle('dark')}
        >
          <ReactMapGL
            {...{
              ...viewport,
              zoom: viewport.zoom > 4 ? viewport.zoom - 4 : viewport.zoom,
            }}
            width="100%"
            height="100%"
            className="rounded-lg"
            mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN} // MAPBOX API ACCESS TOKEN
            mapStyle={Dark}
          />
        </Menu.Item>
        <Menu.Item
          as="button"
          className="block w-20 h-20"
          onClick={() => setMapStyle('satellite')}
        >
          <ReactMapGL
            {...{
              ...viewport,
              zoom: viewport.zoom > 4 ? viewport.zoom - 4 : viewport.zoom,
            }}
            width="100%"
            height="100%"
            className="rounded-lg"
            mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN} // MAPBOX API ACCESS TOKEN
            mapStyle={Satellite}
          />
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
};

export default MapStyleMenu;
