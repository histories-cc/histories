import { MapContext } from '@src/contexts/MapContext';
import React from 'react';
import { HiOutlineChevronLeft } from 'react-icons/hi';

import SortByDropdown from './SortByDropdown';

export type SubNavProps = {
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
};

const SubNav: React.FC<SubNavProps> = ({ sortBy, setSortBy }) => {
  const mapContext = React.useContext(MapContext);

  return (
    <div className="sticky top-0 z-20 flex items-center justify-between w-full px-4 py-4 bg-white border-b border-gray-200 shadow-sm">
      <SortByDropdown sortBy={sortBy} setSortBy={setSortBy} />
      <div className="flex gap-2">
        {mapContext.sidebarPlace ? (
          <>
            <button onClick={() => mapContext.setSidebarPlace(null)}>
              <HiOutlineChevronLeft className="w-8 h-8 py-1 text-gray-500 border border-gray-200 hover:text-black hover:border-gray-400 rounded-xl" />
            </button>
            <div className="px-4 py-1 text-gray-600 border border-gray-200 min-w-24 rounded-xl">
              Place detail
            </div>
          </>
        ) : (
          <>
            <button
              className={`py-1 w-24 border border-gray-200 hover:text-black hover:border-gray-400 ${
                mapContext.whatToShow !== 'photos'
                  ? 'text-black border-gray-400'
                  : 'text-gray-500'
              } rounded-xl`}
              onClick={() => mapContext.setWhatToShow('places')}
            >
              Places
            </button>
            <button
              className={`py-1 w-24 border border-gray-200 hover:text-black hover:border-gray-400 ${
                mapContext.whatToShow === 'photos'
                  ? 'text-black border-gray-400'
                  : 'text-gray-500'
              } rounded-xl`}
              onClick={() => mapContext.setWhatToShow('photos')}
            >
              Photos
            </button>
          </>
        )}
      </div>
      <span />
    </div>
  );
};

export default SubNav;
