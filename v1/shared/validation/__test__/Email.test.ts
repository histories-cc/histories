import { ValidateEmail } from '..';

test('Email', () => {
  // correct
  expect(ValidateEmail('email@example.com')).toEqual({ error: null });
  expect(ValidateEmail('EMAIL@example.com')).toEqual({ error: null });
  expect(ValidateEmail('email@example.co.uk')).toEqual({ error: null });
  expect(ValidateEmail('e-mail@example.co.uk')).toEqual({ error: null });
  expect(ValidateEmail('test.email@example.co.uk')).toEqual({ error: null });
  expect(ValidateEmail('example@example-domain.org')).toEqual({ error: null });

  // wrong
  expect(ValidateEmail('@example.com')).not.toEqual({ error: null });
  expect(
    ValidateEmail(
      'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@example.com'
    )
  ).not.toEqual({ error: null }); // too long
  expect(ValidateEmail('email@example')).not.toEqual({ error: null });
  expect(ValidateEmail('example@.com')).not.toEqual({ error: null });
  expect(ValidateEmail('example.com')).not.toEqual({ error: null });
  expect(ValidateEmail('ema/il@example')).not.toEqual({ error: null });
  expect(ValidateEmail('.com')).not.toEqual({ error: null });
  expect(ValidateEmail('')).not.toEqual({ error: null }); // 0 characters
});
