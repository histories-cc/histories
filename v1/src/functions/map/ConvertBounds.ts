import { IBounds } from '@src/types/map';

function ConvertBounds(bounds: {
  _ne: { lat: number; lng: number };
  _sw: { lat: number; lng: number };
}): IBounds {
  return {
    maxLatitude: bounds._ne.lat,
    minLatitude: bounds._sw.lat,
    maxLongitude: bounds._ne.lng,
    minLongitude: bounds._sw.lng,
  };
}

export default ConvertBounds;
