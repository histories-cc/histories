import { ValidateHashtag } from '..';

test('Firstname and lastname', () => {
  // correct
  expect(ValidateHashtag('Nature')).toEqual({ error: null });
  expect(ValidateHashtag('AmazingPhoto')).toEqual({ error: null });
  expect(ValidateHashtag('Long-Ago')).toEqual({ error: null });
  expect(ValidateHashtag('random_topic')).toEqual({ error: null });

  // wrong
  expect(ValidateHashtag('Frank?xxx')).toEqual({
    error: 'Hashtag is not valid',
  });
  expect(ValidateHashtag('')).toEqual({
    error: 'Hashtag is not valid',
  });
  expect(
    ValidateHashtag(
      'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
    )
  ).toEqual({
    error: 'Hashtag is not valid',
  });
});
