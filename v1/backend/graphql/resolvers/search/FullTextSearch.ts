import RunCypherQuery from '../../../database/RunCypherQuery';

async function FullTextSearch(search: string) {
  const searchString = `*${Array.from(search).join('*')}*`;

  const userSearchQuery = `
    CALL {
        CALL db.index.fulltext.queryNodes("userSearch", $search) YIELD node, score  // fulltext search users in username, first name and last name
        RETURN node{.*} AS user     // return users properties
        ORDER BY score DESC         // sort by best match 
        LIMIT 15
    } 
    RETURN COLLECT(DISTINCT user) AS users
    `;

  const postSearchQuery = `
    CALL {
        CALL db.index.fulltext.queryNodes("postSearch", $search) YIELD node, score  // fulltext search users in username, first name and last name
        RETURN node{.*} AS post     // return users properties
        ORDER BY score DESC         // sort by best match   
        LIMIT 15                   
    } 
    RETURN COLLECT(DISTINCT post) AS posts
    `;

  const result = await RunCypherQuery([
    {
      query: userSearchQuery,
      params: { search: searchString },
    },
    {
      query: postSearchQuery,
      params: { search: searchString },
    },
  ]);

  return {
    users: result[0].records[0].get('users'),
    posts: result[1].records[0].get('posts'),
  };
}

export default FullTextSearch;
