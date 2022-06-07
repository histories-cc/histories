import { ValidateDescription } from '..';

test('Description', () => {
  // correct
  expect(ValidateDescription('My amazing description')).toEqual({
    error: null,
  });
  expect(
    ValidateDescription('description with some awesome EMOJIS 😂😂😂🤔')
  ).toEqual({
    error: null,
  });
  expect(
    ValidateDescription('Some other special characters $ üäëěšščěú ?!')
  ).toEqual({
    error: null,
  });
  expect(ValidateDescription('')).toEqual({
    error: null,
  }); // empty description

  // wrong
  expect(
    ValidateDescription(
      'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
    )
  ).toEqual({
    error: 'Description is too long',
  });
  expect(
    ValidateDescription(
      'Here are some invalid characters " MATCH (n:User) DETACH DELETE n '
    )
  ).toEqual({
    error: 'Description contains invalid characters',
  }); // invalid characters
  expect(
    ValidateDescription('Here are some more invalid characters | \\ / ')
  ).toEqual({
    error: 'Description contains invalid characters',
  }); // invalid characters
});
