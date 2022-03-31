import validator from 'validator';

import { UpdateProfileInput } from '../../../../../src/graphql/index';
import {
  IsValidBio,
  IsValidName,
  IsValidUsername,
} from '../../../../../shared/validation/InputValidation';
import RunCypherQuery from '../../../../database/RunCypherQuery';

const EditUser = async (
  {
    username,
    bio,
    firstName,
    lastName,
    email,
    notificationSettings,
  }: UpdateProfileInput,
  id: number
): Promise<string> => {
  if (username != null && !IsValidUsername(username))
    throw new Error('Invalid username');

  if (email != null && !validator.isEmail(email))
    throw new Error('Invalid email');

  if (firstName != null && !IsValidName(firstName))
    throw new Error('Invalid first name');

  if (lastName != null && !IsValidName(lastName))
    throw new Error('Invalid last name');

  if (!IsValidBio(bio)) throw new Error('Invalid bio');

  // generate query based on variables which are not null or undefined
  const query = `MATCH (user:User)
WHERE ID(user) = $userId
  ${typeof username === 'string' ? `SET user.username = $username\n` : ''}
  ${typeof bio === 'string' ? `SET user.bio = $bio\n` : ''}
  ${typeof firstName === 'string' ? `SET user.firstName = $firstName\n` : ''}
  ${typeof lastName === 'string' ? `SET user.lastName = $lastName\n` : ''}
  ${typeof email === 'string' ? `SET user.email = $email\n` : ''}  
  ${
    typeof notificationSettings?.newFollower === 'boolean'
      ? 'SET user.newFollowerNotification = $newFollower'
      : ''
  }
  ${
    typeof notificationSettings?.followingPlacePost === 'boolean'
      ? 'SET user.followingPlacePostNotification = $followingPlacePost'
      : ''
  }\n
  ${
    typeof notificationSettings?.followingUserPost === 'boolean'
      ? `SET user.followingUserPostNotification = $followingUserPost`
      : ''
  }\n
 ${
   typeof notificationSettings?.newsletter === 'boolean'
     ? 'SET user.newsletterNotification = $newsletter'
     : ''
 }\n
  `;

  await RunCypherQuery({
    query,
    params: {
      ...notificationSettings,
      username,
      firstName,
      lastName,
      email,
      bio,
      userId: id,
    },
  });
  return 'Info edited succesfully';
};

export default EditUser;
