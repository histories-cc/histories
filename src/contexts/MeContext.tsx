import IMeContext from '@src/types/contexts/MeContext';
import { createContext } from 'react';

const MeContext = createContext<IMeContext>({
  isLoggedIn: false,
  me: undefined,
  data: undefined,
  loading: true,
  error: undefined,
  refetch: undefined,
});

export default MeContext;
