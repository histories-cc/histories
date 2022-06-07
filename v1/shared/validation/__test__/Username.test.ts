import { ValidateUsername } from '..';

test('Username', () => {
  // correct
  expect(ValidateUsername('kahy9')).toEqual({ error: null });
  expect(ValidateUsername('_krystofex_')).toEqual({ error: null });
  expect(ValidateUsername('czM1K3')).toEqual({ error: null });
  expect(ValidateUsername('pephis')).toEqual({ error: null });

  // wrong
  expect(ValidateUsername('idk')).toEqual({
    error: 'Username has to be longer than 3 characters',
  }); // too short
  expect(ValidateUsername('')).not.toEqual({ error: null }); // 0 characters
  expect(ValidateUsername('krystofex/xx')).toEqual({
    error:
      'Username can only contain letters, numbers, underscores and periods',
  }); // forbidden characters
  expect(ValidateUsername('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')).toEqual({
    error: 'Username has to be shorter than 32 characters',
  }); // too long
});
