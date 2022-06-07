import { ValidatePassword } from '..';

test('Password', () => {
  // correct
  expect(ValidatePassword('somerandompassword')).toEqual({ error: null }); // normal password
  expect(ValidatePassword('*2cB7C~U')).toEqual({ error: null }); // 8 characters long
  expect(ValidatePassword('Hq=:bb.cTY:A7?GC')).toEqual({ error: null }); // 16 characters long

  // wrong
  expect(ValidatePassword('2short')).toEqual({
    error: 'Password has to be longer than 8 characters',
  }); // too short
  expect(ValidatePassword('')).toEqual({
    error: 'Password has to be longer than 8 characters',
  }); // 0 characters
  expect(
    ValidatePassword(
      '+"QDT#~9`kYpv^!y\bP@6Ch@GZv*Y$~q^FF]g$3.&cWH/G&(^`7aKa{{7_SM-9yKerwxcxtFTCtHqx"uV5)eNA5Pa)J^__"h{kBNG-4v%AJKp}y@Q;f(WU3*".^BeTxCqf'
    )
  ).toEqual({
    error: 'Password has to be shorter than 128 characters',
  }); // too long
});
