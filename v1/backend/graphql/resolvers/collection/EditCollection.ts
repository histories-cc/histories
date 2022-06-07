import RunCypherQuery from '../../../database/RunCypherQuery';

const CreateCollection = async ({
  userId,
  collectionId,
  name,
  description,
  isPrivate,
}: {
  userId: number;
  name: string;
  description: string;
  isPrivate: boolean;
  collectionId: number;
  preview: String;
}): Promise<number> => {
  const query = `MATCH (user:User)-[:CREATED]->(collection:Collection)
WHERE ID(collection) = $collectionId
AND ID(user) = $userId
SET collection.name = $name,
collection.description = $description,
collection.isPrivate = $isPrivate`;

  await RunCypherQuery({
    query,
    params: {
      createdAt: new Date().getTime(),
      description,
      name,
      userId,
      isPrivate,
      collectionId,
    },
  });
  return 0;
};

export default CreateCollection;
