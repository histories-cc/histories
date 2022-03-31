import { CommentsInput } from '../../../../src/graphql/index';
import RunCypherQuery from '../../../database/RunCypherQuery';

async function CommentsQuery(input: CommentsInput) {
  // validate sort options, default is ASC
  const sort =
    input.sort?.toUpperCase() === 'ASC' || input.sort?.toUpperCase() === 'DESC'
      ? input.sort.toUpperCase()
      : 'ASC';
  const sortBy =
    input.sortBy?.toLocaleLowerCase() === 'popularity'
      ? 'popularity'
      : 'createdAt';
  const query = ` 
MATCH (author:User)-[:CREATED]->(comment:Comment)-[:BELONGS_TO]->(target)<-[:CREATED]-(targetAuthor:User)
WHERE (target :Comment OR target :Post) // target has to be post or comment
${input.targetID != undefined ? `AND (target.id = ${input.targetID})` : ''}

WITH comment{.*,
    author: author{.*}, // post author
    target: target{.*,
        author: targetAuthor{.*}
    }
} AS comment

ORDER BY comment.${sortBy} ${sort}

SKIP ${input.skip ?? 0}
LIMIT ${input.take ?? 10}
RETURN COLLECT(DISTINCT comment) AS comments
`;

  const [result] = await RunCypherQuery({ query });

  return result.records[0].get('comments');
}

export default CommentsQuery;
