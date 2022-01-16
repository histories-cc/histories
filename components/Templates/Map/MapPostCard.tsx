import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';
import UrlPrefix from 'shared/config/UrlPrefix';

import { MapContext } from './MapContext';

const MapPostCard: React.FC<{
  place: {
    id: number;
    name?: string | null;
    longitude: number;
    latitude: number;
    icon?: string | null;
    preview?: {
      hash: string;
      blurhash: string;
      width: number;
      height: number;
    };
    description?: string;
  };
}> = ({ place }) => {
  const mapContext = React.useContext(MapContext);

  return (
    <motion.div
      className={`flex flex-col w-full h-64 bg-white border border-gray-200 rounded-lg ${
        mapContext.hoverPlaceId === place.id ? 'border-black shadow-sm' : ''
      }`}
      onClick={() => mapContext.setSidebarPlace(place)}
      onMouseEnter={() => mapContext.setHoverPlaceId(place.id)}
      onMouseLeave={() => mapContext.setHoverPlaceId(null)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.5,
        ease: 'easeInOut',
      }}
    >
      {place.preview && (
        <div className="relative w-full h-full rounded-t-lg cursor-pointer bg-secondary">
          <Image
            src={UrlPrefix + place.preview.hash}
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            className="rounded-t-lg"
            alt="Profile picture"
          />
        </div>
      )}
      <div className="px-4 py-2">
        <h2 className="text-lg font-medium">{place.name}</h2>
        <h3 className="text-gray-600" style={{ fontSize: '12px' }}>
          {place.description?.substring(0, 35)}...
        </h3>
      </div>
    </motion.div>
  );
};

export default MapPostCard;
