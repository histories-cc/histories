import React from 'react';

interface TrackProps {
  source: any;
  target: any;
  getTrackProps: any;
}

const Track: React.FC<TrackProps> = ({ source, target, getTrackProps }) => {
  return (
    <div
      className="absolute z-10 w-2 bg-blue-500"
      style={{
        top: `${source.percent}%`,
        height: `${target.percent - source.percent}%`,
      }}
      {
        ...getTrackProps() /* this will set up events if you want it to be clickeable (optional) */
      }
    />
  );
};

export default Track;
