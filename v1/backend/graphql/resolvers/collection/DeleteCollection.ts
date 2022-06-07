import RunCypherQuery from '../../../database/RunCypherQuery';

const CreateCollection = async ({
  userId,
  collectionId,
}: {
  userId: number;
  collectionId: number;
}): Promise<number> => {
  const query = `MATCH (user:User)-[:CREATED]->(collection:Collection)
WHERE ID(collection) = $collectionId
AND ID(user) = $userId
DETACH DELETE collection`;

  await RunCypherQuery({
    query,
    params: {
      userId,
      collectionId,
    },
  });
  return 0;
};

export default CreateCollection;
