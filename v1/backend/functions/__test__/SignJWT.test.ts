import SignJWT from '../SignJWT';
import { verify } from 'jsonwebtoken';

describe('Test JWT', () => {
  const id = '32819';
  const secret = 'jkasdfjkaadls';

  const decoded = verify(SignJWT(id, secret), secret);
  if (typeof decoded === 'string') return;

  test('Generate and verify JWT', () => {
    expect(decoded.id).toEqual(id);
  });
});
