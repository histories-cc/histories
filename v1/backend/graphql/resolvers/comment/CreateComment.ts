import { IsValidComment } from '../../../../shared/validation/InputValidation';
import RunCypherQuery from '../../../database/RunCypherQuery';

const CreateComment = async ({
  authorID,
  targetID,
  content,
}: {
  authorID: number;
  targetID: number;
  content: string;
}): Promise<string> => {
  if (!IsValidComment(content)) throw new Error('Invalid comment');

  const query = `
  MATCH (target),(author:User)
  WHERE target.id = $targetId
    AND author.id = $authorId
    // if target is post or comment connected to post
    AND (target:Post OR (target:Comment AND EXISTS((target)-[:BELONGS_TO]->(:Post))))
  CREATE (author)-[:CREATED]->(comment:Comment {
    createdAt: $createdAt,
    edited: false,
    content: $content
  })-[:BELONGS_TO]->(target)
  SET comment.id = ID(comment)
  `;

  await RunCypherQuery({
    query,
    params: {
      targetId: targetID,
      createdAt: new Date().getTime(),
      content,
      authorId: authorID,
    },
  });

  return 'success';
};

export default CreateComment;
