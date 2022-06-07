import { sign } from 'jsonwebtoken';

function SignJWT(id: string, secret: string) {
  // create and return jwt
  return sign(
    // JWT payload
    {
      id,
    },
    secret, // JWT secret
    {
      expiresIn: '360min', // JWT token expiration
    }
  );
}

export default SignJWT;
