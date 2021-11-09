import RunCypherQuery from '../database/RunCypherQuery';

// QUERY - users prosnalized posts
/*
 * MATCH (user:User)       // match logged user
 * WHERE ID(user) = 92
 * CALL {
 *    WITH user                                               // get user
 *    OPTIONAL MATCH (author:User)-[:CREATED]->(post:Post)    // get posts created by followed users or by user
 *    WHERE ((user)-[:FOLLOW]->(author)) OR (user = author)
 *    RETURN post, author                                     // return posts and author
 *    ORDER BY post.createdAt DESC                            // order posts by date
 *    SKIP                                                    // skip because of infinite scroll
 *    LIMIT 100                                               // limit posts
 * }
 * RETURN COLLECT(DISTINCT post{.*, id: ID(post)}) AS posts   // return posts as object
 */

// QUERY - all posts sorted (for anonymous users)
/*
 * CALL {
 * MATCH (author:User)-[:CREATED]->(post)    // get all posts
 *    RETURN author, post                    // return author and post
 *    ORDER BY post.createdAt DESC           // order posts by created date
 *    LIMIT 100                              // limit posts
 *    SKIP 0                                 // skip because of infinite scroll
 * }
 * RETURN COLLECT(DISTINCT post{.*, id: ID(post), author:author{.*, id: ID(author)} }) as posts   // return posts as object
 */

const PersonalizedPostsQuery = async (logged: number | null) => {
  const query =
    logged === null
      ? `CALL {
        MATCH (author:User)-[:CREATED]->(post)
        RETURN author, post
        ORDER BY post.createdAt DESC
        SKIP 0
        LIMIT 100
    }
    RETURN COLLECT(DISTINCT post{.*, id: ID(post), author:author{.*, id: ID(author)} }) as posts`
      : `MATCH (user:User)
      WHERE ID(user) = ${logged}
      CALL {
          WITH user
          OPTIONAL MATCH (author:User)-[:CREATED]->(post:Post)
          WHERE ((user)-[:FOLLOW]->(author)) OR (user = author)
          RETURN post, author
          ORDER BY post.createdAt DESC
          SKIP 0
          LIMIT 100
      }
      RETURN COLLECT(DISTINCT post{.*, id: ID(post)}) AS posts`;

  const result = await RunCypherQuery(query);

  return result.records[0].get('posts');
};

export default PersonalizedPostsQuery;
