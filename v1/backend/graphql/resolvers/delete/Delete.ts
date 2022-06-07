import RunCypherQuery from '../../../database/RunCypherQuery';

const Delete = async ({
  logged,
  id,
}: {
  logged: number;
  id: number;
}): Promise<string> => {
  const query = `WITH ${id} AS targetID, ${logged} AS userID
  OPTIONAL MATCH (comment:Comment)-[:BELONGS_TO*1..2]->({id: targetID}) 
  OPTIONAL MATCH ({id: targetID})-[:CONTAINS]->(photo:Photo)
  MATCH (user:User {id: userID}), (target {id: targetID})
  WHERE ((user)-[:CREATED]->(target) OR user :Admin)
    AND (target :Post OR target :Comment OR target :Collection)
  DETACH DELETE target, comment, photo
  `;

  await RunCypherQuery({ query });

  return 'deleted';
};

export default Delete;
