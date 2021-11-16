import RunCypherQuery from '../../database/RunCypherQuery';

const CreateCollection = async ({
  username,
  collectionName,
  description,
}: {
  username: string;
  collectionName: string;
  description: string;
}): Promise<number> => {
  const query = `MATCH 
  (author:User)
    WHERE author.username =~ "(?i)${username}"
    CREATE (collection:Collection {
    collectionName: $collectionName,
    description: $description,
    createdAt: $createdAt
    })
    CREATE (author)-[r:CREATED]->(collection)
  `;

  await RunCypherQuery(query, {
    createdAt: new Date().getTime(),
    description,
    collectionName,
    username,
  });

  return 0;
};

export default CreateCollection;
