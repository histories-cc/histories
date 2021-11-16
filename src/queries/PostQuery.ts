import RunCypherQuery from '../database/RunCypherQuery';

const PostQuery = async ({
  id,
  logged,
}: {
  id: number;
  logged: number | null;
}) => {
  const query = `MATCH (author:User)-[:CREATED]->(post:Post)-[:IS_LOCATED]->(place:Place)${
    logged ? ', (logged:User)' : ''
  }
  WHERE ID(post) = $postId ${logged ? `AND ID(logged) = ${logged}` : ''}
  CALL {
      WITH post
      OPTIONAL MATCH (user:User)-[:LIKE]->(post)
      RETURN DISTINCT user AS like
      LIMIT 100
  }
  CALL {
      WITH post
      OPTIONAL MATCH (user:User)-[:CREATED]->(comment:Comment)-[:BELONGS_TO]->(post)
      RETURN DISTINCT comment, user AS commentAuthor
      ORDER BY comment.createdAt DESC
      LIMIT 100
  }
  ${
    logged
      ? `CALL {
    WITH comment, logged 
    RETURN EXISTS((logged)-[:LIKE]->(comment)) AS likedComment
}`
      : ''
  }


  CALL {
      WITH post
      OPTIONAL MATCH (hashtag:Hashtag)-[:CONTAINS]->(post)
      RETURN DISTINCT hashtag
      LIMIT 100
  }
      
  RETURN post{.*, id: ID(post), 
      place: place{.*, latitude: place.location.latitude, longitude: place.location.longitude, id: ID(place)},
      author: author{.*, id: ID(author)},
      liked: ${logged ? 'EXISTS((logged)-[:LIKE]->(post))' : 'false'},
      likes: COLLECT(DISTINCT like{.*, id: ID(like)}),
      hashtags: COLLECT(hashtag{.*, id:ID(hashtag)}),
      comments: COLLECT(DISTINCT comment{.*,
        id:ID(comment),
        liked: ${logged ? 'likedComment' : 'false'},
        author: commentAuthor{.*, id: ID(commentAuthor)}})    
  } AS post`;

  const result = await RunCypherQuery(query, { postId: id });

  if (result.records[0] === undefined) throw new Error('Post does not exist');
  else
    return {
      ...result.records[0].get('post'),
      url: result.records[0].get('post').url,
    };
};

export default PostQuery;
