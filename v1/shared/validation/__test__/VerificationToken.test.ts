import ValidateVerificationToken from '../inputValidation/ValidateVerificationToken';

test('Verification token', () => {
  // correct
  expect(
    ValidateVerificationToken(
      '1632445649755-b8a689c1-cdae-450e-9da1-770e63dfb8b2'
    )
  ).toEqual({ error: null });

  expect(
    ValidateVerificationToken(
      '1632445649755-b8a689c1-cdae-450e-9da1-770e63dfb8b2'
    )
  ).toEqual({ error: null });

  // wrong
  expect(
    ValidateVerificationToken('16325-b8a689c1-cdae-450e-9da1-770e63dfb8b2')
  ).toEqual({ error: 'invalid verification token' });

  expect(
    ValidateVerificationToken(
      '1632445649755-b8a689c1-cdae-45i0e-9da1-770e63dfb8b2'
    )
  ).toEqual({ error: 'invalid verification token' });
});
