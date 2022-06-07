import { ValidateDate } from '..';

describe('Date', () => {
  test('Correct', () => {
    expect(ValidateDate(22843729)).toEqual({
      error: null,
    });
  });

  test('Correct', () => {
    expect(ValidateDate(new Date().getTime() - 10)).toEqual({
      error: null,
    });
  });

  test('Invalid', () => {
    expect(ValidateDate(new Date().getTime() + 1000)).toEqual({
      error: 'Invalid date',
    });
  });

  test('Invalid', () => {
    // @ts-expect-error
    expect(ValidateDate()).toEqual({
      error: 'Invalid date',
    });
  });

  test('Invalid', () => {
    // @ts-expect-error
    expect(ValidateDate(undefined)).toEqual({
      error: 'Invalid date',
    });
  });

  test('Invalid', () => {
    expect(ValidateDate(new Date().getTime() + 250000)).toEqual({
      error: 'Invalid date',
    });
  });

  test('Invalid', () => {
    expect(ValidateDate(-50000000000500)).toEqual({
      error: 'Invalid date',
    });
  });
});
