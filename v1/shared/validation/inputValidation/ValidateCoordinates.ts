const ValidateCoordinates = ([latitude, longitude]: [number, number]): {
  error: string | null;
} => {
  if (
    latitude === undefined ||
    latitude === null ||
    longitude === undefined ||
    longitude === null
  )
    return { error: 'Invalid coordinates' };

  // checking coordinates by ISO 6709 - decimal degrees
  if (latitude < -90 || latitude > 90) return { error: 'Invalid latitude' };
  else if (longitude < -360 || longitude > 360)
    return { error: 'Invalid longitude' };
  else return { error: null };
};

export default ValidateCoordinates;
