import RunCypherQuery from '../../database/RunCypherQuery';

// QUERY
/*
 * MATCH (user:User)
 * WHERE ID(user) = $id                                                     - match user by id
 * ${username !== undefined ? `SET user.username = "${username}" ` : ''}    - only add this line to query if variable isn't undefined
 * ${bio !== undefined ? `SET user.bio = "${bio}" ` : ''}                   - only add this line to query if variable isn't undefined
 * ${firstName !== undefined ? `SET user.firstName = "${firstName}" ` : ''} - only add this line to query if variable isn't undefined
 * ${lastName !== undefined ? `SET user.lastName = "${lastName}" ` : ''}    - only add this line to query if variable isn't undefined
 * ${email !== undefined ? `SET user.email = "${email}" ` : ''}             - only add this line to query if variable isn't undefined
 * ${password !== undefined ? `SET user.password = "${password}" ` : ''}    - only add this line to query if variable isn't undefined
 */

const EditProfile = async ({
  id,
  username,
  bio,
  firstName,
  lastName,
  email,
  password,
}: {
  id: number;
  username: string | undefined;
  bio: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  email: string | undefined;
  password: string | undefined;
}): Promise<string> => {
  const query = `MATCH (user:User)
WHERE ID(user) = $userId
${username !== undefined ? `SET user.username = $username\n` : ''}${
    bio !== undefined ? `SET user.bio = $bio\n` : ''
  }${firstName !== undefined ? `SET user.firstName = $firstName\n` : ''}${
    lastName !== undefined ? `SET user.lastName = $lastName\n` : ''
  }${email !== undefined ? `SET user.email = $email\n` : ''}${
    password !== undefined ? `SET user.password = $password\n` : ''
  }`;

  await RunCypherQuery(query, {
    username,
    firstName,
    lastName,
    email,
    password,
    bio,
    userId: id,
  });
  return 'Info edited succesfully';
};

export default EditProfile;
