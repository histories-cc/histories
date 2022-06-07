import RunCypherQuery from '../../../database/RunCypherQuery';

const Like = async ({
  loggedID,
  id,
}: {
  loggedID: number;
  id: number;
}): Promise<void> => {
  const query = `
  MATCH (user:User)-[like:LIKE]->(target)
  WHERE ID(user) = $loggedID  // match user by id
    AND ID(target) = $id  // match target by id
  DELETE like // delete relation
  `;

  await RunCypherQuery({ query, params: { loggedID, id } });
};

export default Like;
