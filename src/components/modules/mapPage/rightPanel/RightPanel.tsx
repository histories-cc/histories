import { MapContext } from '@src/contexts/MapContext';
import React, { useState } from 'react';

import Photos from './Photos';
import Place from './Place';
import Places from './Places';
import { SubNav } from './subNav';

const RightPanel: React.FC = () => {
  const mapContext = React.useContext(MapContext);

  const [sortBy, setSortBy] = useState('Hot');

  return mapContext.showSidebar ? (
    <div className="relative hidden w-0 h-0 overflow-y-auto md:w-full md:h-full md:block">
      {!mapContext.sidebarPlace && (
        <SubNav sortBy={sortBy} setSortBy={setSortBy} />
      )}
      <div /* this div is for posts to not have weird spacing between them on Y */
      >
        <div
          className={`text-black dark:text-white ${
            mapContext.sidebarPlace
              ? ''
              : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-flow-row gap-4 h-full'
          }`}
        >
          {mapContext.sidebarPlace ? (
            <Place id={mapContext.sidebarPlace} />
          ) : mapContext.whatToShow === 'photos' ? (
            <Photos />
          ) : (
            <Places />
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default RightPanel;
