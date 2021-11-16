import RunCypherQuery from '../../database/RunCypherQuery';

// QUERY
/*
 * MATCH (author:User), (target)
 * WHERE ID(author) = 1 AND ID(target) = 6    - match nodes by IDs
 * CREATE (author)-[:CREATED]->(:Comment {    - create yrelation
 *    createdAt: 1635490076649,               - created at
 *    content: "comment content"              - comment content
 *    edited: false                           - default edited false
 * })-[:BELONGS_TO]->(target)                 - target relation
 */

const CreateComment = async ({
  authorID,
  targetID,
  content,
}: {
  authorID: number;
  targetID: number;
  content: string;
}): Promise<void> => {
  await RunCypherQuery(
    `MATCH (target),(author:User) WHERE ID(target) = $targetId AND ID(author) = $authorId AND (target:Post OR target:Comment)
CREATE (author)-[:CREATED]->(:Comment{createdAt:$createdAt,edited:false,content:$content})-[:BELONGS_TO]->(target)`,
    {
      targetId: targetID,
      createdAt: new Date().getTime(),
      content,
      authorId: authorID,
    }
  );
};

export default CreateComment;
