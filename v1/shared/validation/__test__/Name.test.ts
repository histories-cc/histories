import { ValidateName } from '..';

test('Firstname and lastname', () => {
  // correct
  expect(ValidateName('Kryštof')).toEqual({ error: null }); // local characters
  expect(ValidateName('Sömething')).toEqual({ error: null }); // local characters

  // wrong
  expect(ValidateName('Frank?xxx')).toEqual({
    error: 'can\'t contain special characters like \\/*?!"<>|',
  }); // forbidden characters
  expect(ValidateName('')).toEqual({
    error: 'is empty',
  }); // empty
  expect(
    ValidateName(
      'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
    )
  ).toEqual({
    error: 'has to be shorter than 128 characters',
  }); // too long
});
