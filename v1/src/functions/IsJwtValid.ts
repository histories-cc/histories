import { verify } from 'jsonwebtoken';

function IsJwtValid(jwt: string) {
  try {
    // verify JWT
    verify(jwt, process.env.JWT_SECRET!);
    return true;
  } catch (err) {
    return false;
  }
}

export default IsJwtValid;
