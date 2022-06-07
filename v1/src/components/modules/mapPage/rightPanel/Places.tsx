import UrlPrefix from '@src/constants/IPFSUrlPrefix';
import { MapContext } from '@src/contexts/MapContext';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

const Places: React.FC = () => {
  const mapContext = useContext(MapContext);

  const { t } = useTranslation();

  return (
    <>
      {mapContext.placesQuery?.data?.places
        .filter((place) =>
          place.years.some(
            (year) =>
              year >= mapContext.timeLimitation[0] &&
              year <= mapContext.timeLimitation[1]
          )
        )
        .filter(
          (place) =>
            place.latitude > mapContext.bounds.minLatitude &&
            place.latitude < mapContext.bounds.maxLatitude &&
            place.longitude > mapContext.bounds.minLongitude &&
            place.longitude < mapContext.bounds.maxLongitude &&
            place?.preview?.hash
        )
        .map(
          (place, index) =>
            place.preview && (
              <motion.div
                key={index}
                className={`flex flex-col w-full h-64 bg-zinc-300 dark:bg-zinc-800/80 rounded-md ${
                  mapContext.hoverPlaceId === place.id ? 'shadow-lg' : ''
                }`}
                onClick={() => mapContext.setSidebarPlace(place.id)}
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
                  <div className="relative w-full h-full cursor-pointer bg-secondary">
                    <Image
                      src={UrlPrefix + place.preview.hash}
                      layout="fill"
                      objectFit="cover"
                      objectPosition="center"
                      className="rounded-md"
                      alt={t('place_preview')}
                    />
                    <div className="absolute bottom-0 left-0 w-full h-full text-center rounded-md bg-gradient-to-t from-[#000000ee] via-transparent to-transparent">
                      <a className="absolute w-full px-2 text-base font-bold text-white bottom-2 -translate-x-1/2">
                        {place?.name}
                      </a>
                    </div>
                  </div>
                )}
              </motion.div>
            )
        ) ?? null}
    </>
  );
};

export default Places;
