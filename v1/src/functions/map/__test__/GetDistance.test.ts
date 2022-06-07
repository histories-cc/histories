import GetDistance from '../GetDistance';

// just test comparing values based on the distance between the two points
// this function doesn't need to be geographically accurate
describe('Get distance between two points', () => {
  test('Try some values', () => {
    expect(
      GetDistance([38.8976, -77.0366], [39.9496, -75.1503]) <
        GetDistance([0.8976, -32.2366], [39.9496, -75.1503])
    ).toEqual(true);
    expect(GetDistance([39.9496, -75.1503], [39.9496, -75.1503])).toEqual(0);
    expect(
      GetDistance([38.8976, -77.0366], [39.9496, -75.1503]) ===
        GetDistance([38.8976, -77.0366], [39.9496, -75.1503])
    ).toEqual(true);
    expect(
      GetDistance([12.13468, -87.48464], [39.9496, -75.1503]) <
        GetDistance([0.61157, -54.4987], [39.9496, -75.1503])
    ).toEqual(true);
  });
});
