import { MapContext } from '@src/contexts/MapContext';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useContext } from 'react';
import { HiOutlineChevronLeft } from 'react-icons/hi';

import { Map } from './map';
import RightPanel from './rightPanel/RightPanel';

const MapPageGrid: React.FC = () => {
  const mapContext = useContext(MapContext);

  return (
    <div
      className="w-full text-black bg-[#FAFBFB] dark:bg-zinc-900 dark:text-white"
      style={{ height: 'calc(100vh - 56px)' }}
    >
      <AnimatePresence>
        {/* MAIN GRID */}
        <motion.section
          initial={{
            gridTemplateColumns: '50% 50%',
          }}
          animate={{
            gridTemplateColumns: mapContext.showSidebar ? '50% 50%' : '100% 0%',
          }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className={`w-full h-full grid grid-rows-1 ${''} `}
        >
          {/* LEFT PANEL */}
          <div className="relative w-full h-full col-span-2 md:col-span-1">
            {/* HIDE SIDEBAR ARROW ICON */}
            <button
              onClick={() => mapContext.setShowSidebar(!mapContext.showSidebar)}
              className="absolute right-0 z-10 flex items-center invisible px-1 py-2 rounded-l-lg bg-[#FAFBFB] dark:bg-[#171716] top-1/2 transform -translate-y-1/2 md:visible"
            >
              <HiOutlineChevronLeft
                className={`w-6 h-6 transition-all duration-500 ease-in-out ${
                  mapContext.showSidebar ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </button>
            {/* MAP */}
            <Map />
          </div>

          {/* RIGHT PANEL */}
          <RightPanel />
        </motion.section>
      </AnimatePresence>
    </div>
  );
};

export default MapPageGrid;
