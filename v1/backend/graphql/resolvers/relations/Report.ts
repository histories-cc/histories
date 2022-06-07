import RunCypherQuery from '../../../database/RunCypherQuery';

const Report = async ({
  logged,
  target,
}: {
  logged: number;
  target: number;
}): Promise<void> => {
  const query = `
  MATCH (user:User), (target) 
  WHERE ID(user) = $logged 
    AND ID(target) = $target
    AND (target:Post OR target:Comment OR target:Hashtag)
  MERGE (user)-[r:REPORT]-(target) 
  SET r.createdAt = $createdAt,
      r.type = ""`;

  await RunCypherQuery({
    query,
    params: { logged, target, createdAt: new Date().getTime() },
  });
};

export default Report;
