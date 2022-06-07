import RunCypherQuery from '../../../database/RunCypherQuery';

const Unfollow = async (logged: number, userID: number): Promise<void> => {
  const query = `
 MATCH (user:User)-[r:FOLLOW]->(target)
 WHERE ID(user) = $logged
  AND ID(target) = $userID
 DELETE r
 `;

  await RunCypherQuery({ query, params: { logged, userID } });
};

export default Unfollow;
