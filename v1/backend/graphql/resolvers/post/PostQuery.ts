import RunCypherQuery from '../../../database/RunCypherQuery';

const PostQuery = async ({
  id,
  logged,
}: {
  id: number;
  logged: number | null;
}) => {
  const query = `
  MATCH (author:User)-[:CREATED]->(post:Post)-[:IS_LOCATED]->(place:Place) ${
    logged ? ', (logged:User)' : ''
  }
  WHERE post.id = $postId ${logged ? `AND logged.id = ${logged}` : ''}
 
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

  CALL {
    WITH post
    OPTIONAL MATCH (post)-[:CONTAINS]->(photo:Photo)
    RETURN photo
    ORDER BY photo.index ASC
  }
      
  CALL {
    WITH place
    MATCH (photo:Photo)<-[:CONTAINS]-(post:Post)-[:IS_LOCATED]->(place), (n)-->(post)
    OPTIONAL MATCH (place)-[:HAS_PREVIEW]->(preview:Photo)
    RETURN  COLLECT(n) AS photoRelations, photo AS placePreview, preview
    ORDER BY SIZE(photoRelations) DESC
    LIMIT 1
  }

  CALL {
    WITH post
    OPTIONAL MATCH (:User)-[r:LIKE]->(post)  // match users who liked post
    RETURN COUNT(r) AS likeCount  // return number
  }


  RETURN post{.*, 
      place: place{.*,
        latitude: place.location.latitude,
        longitude: place.location.longitude,
        preview:  
          CASE
            WHEN preview IS NOT NULL 
              THEN preview{.*, index: 0}  // if there is a place preview
              ELSE placePreview{.*}       // else select most popular photo
            END
      },
      author: author{.*},
      liked: ${logged ? 'EXISTS((logged)-[:LIKE]->(post))' : 'false'},
      likes: COLLECT(DISTINCT like{.*}),
      likeCount,
      hashtags: COLLECT(hashtag{.*, id:ID(hashtag)}),
      photos: COLLECT(DISTINCT photo{.*}),
      comments: COLLECT(DISTINCT comment{.*,
        liked: ${logged ? 'likedComment' : 'false'},
        author: commentAuthor{.*}})    
  } AS post`;

  const [result] = await RunCypherQuery({ query, params: { postId: id } });

  if (result.records[0] === undefined) throw new Error('Post does not exist');
  else return result.records[0].get('post');
};

export default PostQuery;
