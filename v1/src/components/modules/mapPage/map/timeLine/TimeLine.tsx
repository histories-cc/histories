import { MapContext } from '@src/contexts/MapContext';
import React from 'react';
import { Handles, Rail, Slider, Tracks } from 'react-compound-slider';

import { minYearConstant } from '../../../../../../shared/constants/constants';

const TimeLine: React.FC = ({}) => {
  const mapContext = React.useContext(MapContext);

  return (
    <Slider
      vertical
      reversed
      mode={2}
      rootStyle={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
      domain={[minYearConstant, new Date().getFullYear()]}
      step={1}
      values={[mapContext.timeLimitation[1], mapContext.timeLimitation[0]]}
      onUpdate={(limits) =>
        mapContext.setTimeLimitation([limits[1], limits[0]])
      }
    >
      <Rail>
        {({ getRailProps }) => (
          <div
            className="absolute h-full px-4 py-4 bg-white rounded shadow dark:bg-zinc-700 -translate-x-1/2"
            {...getRailProps()}
          >
            <div className="h-full border border-gray-400" />
          </div>
        )}
      </Rail>
      <Handles>
        {({ handles, getHandleProps }) => (
          <>
            {handles.map(({ id, value, percent }) => (
              <div
                key={id}
                className={`absolute px-2 cursor-pointer py-1 bg-white dark:bg-zinc-700 text-xs rounded shadow border border-gray-300 dark:border-zinc-600 -translate-x-1/2 -translate-y-1/2 z-20 font-bold text-brand`}
                style={{
                  top: `${percent}%`,
                }}
                {...getHandleProps(id)}
              >
                {value}
              </div>
            ))}
          </>
        )}
      </Handles>
      <Tracks left={false} right={false}>
        {({ tracks }) => (
          <div className="slider-tracks">
            {tracks.map(({ id, source, target }) => (
              <div
                key={id}
                className="absolute z-10 w-2 bg-brand -translate-x-1/2"
                style={{
                  top: `${source.percent}%`,
                  height: `${target.percent - source.percent}%`,
                }}
              />
            ))}
          </div>
        )}
      </Tracks>
    </Slider>
  );
};

export default TimeLine;
