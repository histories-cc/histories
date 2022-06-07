import ConvertBounds from '../ConvertBounds';

describe('Convert bounds', () => {
  test('Convert bounds from React-map-gl format to Histories format', () => {
    expect(
      ConvertBounds({
        _ne: { lat: 32, lng: 12 },
        _sw: { lat: 56, lng: 23 },
      })
    ).toEqual({
      maxLatitude: 32,
      minLatitude: 56,
      maxLongitude: 12,
      minLongitude: 23,
    });
  });
});
