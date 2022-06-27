import UserContext from '@src/contexts/UserContext';
import React, { useContext } from 'react';

const UsersPostsTemplate: React.FC = () => {
  // contexts
  const { user } = useContext(UserContext);

  // hooks

  return <>{user?.username}</>;
};

export default UsersPostsTemplate;
