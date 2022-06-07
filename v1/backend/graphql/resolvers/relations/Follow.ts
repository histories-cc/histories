import RunCypherQuery from '../../../database/RunCypherQuery';

const Follow = async (logged: number, target: number): Promise<void> => {
  const query = `
  MATCH (user:User), (target)
  WHERE ID(user) = $logged
    AND ID(target) = $target
    AND (target: User OR target: Hashtag OR target: Place)
    AND NOT EXISTS((user)-[:FOLLOW]->(target))
  CREATE (user)-[:FOLLOW {createdAt: $createdAt}]->(target)
  `;

  await RunCypherQuery({
    query,
    params: { createdAt: new Date().getTime(), logged, target },
  });
};

export default Follow;
