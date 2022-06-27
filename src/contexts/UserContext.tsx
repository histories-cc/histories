import { IUserContext } from '@src/types/contexts';
import { createContext } from 'react';

const UserContext = createContext<IUserContext>({
  user: undefined,
  data: undefined,
  loading: true,
  error: undefined,
  refetch: undefined,
});

export default UserContext;
