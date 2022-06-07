import RunCypherQuery from '../../database/RunCypherQuery';

// returns time when was created users last post
const LastPost = async ({ userID }: { userID: any }): Promise<any> => {
  const query = `MATCH (user:User)-[:CREATED]->(object)
    WHERE ID(user) = ${userID}
    RETURN object.createdAt ORDER BY object.createdAt DESC
    LIMIT 1`;

  const [output] = await RunCypherQuery({ query });

  return output.records[0] ? output.records[0].get('object.createdAt') : null;
};

export default LastPost;
