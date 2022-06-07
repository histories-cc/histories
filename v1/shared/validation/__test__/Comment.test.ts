import { ValidateComment } from '..';

describe('Comment', () => {
  test('Correct', () => {
    expect(ValidateComment('My amazing description')).toEqual({
      error: null,
    });
  });

  test('With emoji', () => {
    expect(
      ValidateComment('description with some awesome EMOJIS 😂😂😂🤔')
    ).toEqual({
      error: null,
    });
  });

  test('Allowed special characters', () => {
    expect(
      ValidateComment('Some other special characters $ üäëěšščěú ?!')
    ).toEqual({
      error: null,
    });
  });

  test('Empty', () => {
    expect(ValidateComment('')).toEqual({
      error: 'Comment cannot be empty',
    });
  });
});
