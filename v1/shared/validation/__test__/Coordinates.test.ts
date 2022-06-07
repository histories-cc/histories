import { ValidateCoordinates } from '..';

describe('Coordinates', () => {
  test('Correct', () => {
    expect(ValidateCoordinates([50.2031777, 15.4742032])).toEqual({
      error: null,
    });
  });

  test('Correct', () => {
    expect(ValidateCoordinates([-89.2426777, -56.5822032])).toEqual({
      error: null,
    });
  });

  test('Correct', () => {
    expect(ValidateCoordinates([0, 0])).toEqual({
      error: null,
    });
  });

  test('Invalid latitude', () => {
    expect(ValidateCoordinates([-92, 0])).toEqual({
      error: 'Invalid latitude',
    });
  });

  test('Invalid latitude', () => {
    expect(ValidateCoordinates([92, 0])).toEqual({
      error: 'Invalid latitude',
    });
  });

  test('Invalid longitude', () => {
    expect(ValidateCoordinates([0, 480])).toEqual({
      error: 'Invalid longitude',
    });
  });

  test('Invalid longitude', () => {
    expect(ValidateCoordinates([0, -480])).toEqual({
      error: 'Invalid longitude',
    });
  });

  test('Invalid coordinates', () => {
    // @ts-expect-error
    expect(ValidateCoordinates([undefined, 27])).toEqual({
      error: 'Invalid coordinates',
    });
  });

  test('Invalid coordinates', () => {
    // @ts-expect-error
    expect(ValidateCoordinates([null, null])).toEqual({
      error: 'Invalid coordinates',
    });
  });
});
