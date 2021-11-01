import RunCypherQuery from '../../database/RunCypherQuery';

const deleteUser = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<void> => {
  const query = `MATCH (n:User {username: "${username}"}) DETACH DELETE n`;

  await RunCypherQuery(query);
};

export default deleteUser;
