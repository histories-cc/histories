import RunCypherQuery from '../../../database/RunCypherQuery';

const CreateCollection = async ({
  userId,
  name,
  description,
  preview,
  isPrivate,
}: {
  userId: number;
  name: string;
  description?: string | null;
  isPrivate: boolean;
  preview: String;
}): Promise<number> => {
  // limit to max 50 collections
  const query = `MATCH (user:User)
WHERE ID(user) = $userId
CALL { 
    WITH user
    OPTIONAL MATCH (user:User)-[:CREATED]->(collection:Collection)
    WITH SIZE(COLLECT(DISTINCT collection)) AS collectionCount, user
    WHERE collectionCount < 50
    CREATE (user)-[:CREATED]->(newCollection:Collection {createdAt: $createdAt, name: $name, description: $description, preview: $preview, isPrivate: $isPrivate})
    RETURN newCollection
}
RETURN newCollection{.*, id: ID(newCollection)} AS collection`;

  await RunCypherQuery({
    query,
    params: {
      createdAt: new Date().getTime(),
      description,
      name,
      userId,
      preview,
      isPrivate,
    },
  });
  return 0;
};

export default CreateCollection;
