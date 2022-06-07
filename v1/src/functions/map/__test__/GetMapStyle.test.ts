import GetMapStyle from '../GetMapStyle';
import { Dark, Light, Satellite } from '../../../constants/MapStyles';

// test different situations
describe('Get map style', () => {
  test('Test parameters', () => {
    expect(GetMapStyle('theme', 'dark')).toEqual(Dark);
    expect(GetMapStyle('theme', 'light')).toEqual(Light);
    expect(GetMapStyle('satellite')).toEqual(Satellite);
    expect(GetMapStyle('dark')).toEqual(Dark);
    expect(GetMapStyle('light')).toEqual(Light);
    expect(GetMapStyle('satellite', 'dark')).toEqual(Satellite);
    expect(GetMapStyle('dark', 'dark')).toEqual(Dark);
    expect(GetMapStyle('light', 'dark')).toEqual(Light);
    expect(GetMapStyle('satellite', 'light')).toEqual(Satellite);
    expect(GetMapStyle('dark', 'light')).toEqual(Dark);
    expect(GetMapStyle('light', 'light')).toEqual(Light);
  });
});
