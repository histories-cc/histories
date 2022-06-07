import RunCypherQuery from '../../../database/RunCypherQuery';

const Like = async ({
  logged,
  target,
  type,
}: {
  logged: number;
  target: number;
  type: string;
}): Promise<void> => {
  const query = `
  MATCH (user:User), (target)
  WHERE ID(user) = $logged 
    AND ID(target) = $target
    AND (target:Post OR target:Comment)
  MERGE (user)-[r:LIKE]->(target)
  SET r.createdAt = $createdAt,
      r.type = $type`;

  await RunCypherQuery({
    query,
    params: { logged, createdAt: new Date().getTime(), type, target },
  });
};

export default Like;
