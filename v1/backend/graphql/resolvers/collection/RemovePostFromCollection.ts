import RunCypherQuery from '../../../database/RunCypherQuery';

const RemovePostFromCollection = async ({
  userId,
  postId,
  collectionId,
}: {
  userId: number;
  postId: number;
  collectionId: number;
}): Promise<void> => {
  const query = `
  MATCH (user:User)-[:CREATED]->(collection:Collection)-[r:CONTAINS]->(post:Post)
  WHERE ID(collection) = $collectionId
    AND ID(post) = $postId
    AND ID(user) = $userId
  DELETE r`;

  await RunCypherQuery({ query, params: { userId, postId, collectionId } });
};

export default RemovePostFromCollection;
