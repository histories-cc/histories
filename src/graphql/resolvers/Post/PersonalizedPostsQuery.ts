import neo4j from 'neo4j-driver';

import RunCypherQuery from '../../../database/RunCypherQuery';

const PersonalizedPostsQuery = async ({
  logged,
  skip,
  take,
}: {
  logged: number | null;
  skip: number;
  take: number;
}) => {
  const query = `MATCH (user:User)
        ${
          logged !== null ? 'WHERE ID(user) = $loggedId ' : ''
        } // id of logged user as parameter
      
      // post, author and place
      CALL {
          WITH user
          OPTIONAL MATCH (author:User)-[:CREATED]->(post:Post)-[:IS_LOCATED]->(place:Place), (author:User)-[:CREATED]->(post:Post)-[:CONTAINS]->(photo:Photo)
          ${
            logged !== null
              ? 'WHERE ((user)-[:FOLLOW]->(author)) OR (user = author)'
              : ''
          }
          RETURN photo, post, author, place
          ORDER BY post.createdAt DESC    // sort by newest
          // skip and limit for infinite scroll as parameters
          SKIP $skip 
          LIMIT $limit
      }

   
      
      // number of posts in place
      CALL {
          WITH place
          MATCH (post:Post)-[:IS_LOCATED]->(place)
          RETURN COUNT(DISTINCT post) AS placePostsCount  // return count
      }
      
      // number of likes in place
      CALL {
          WITH place
          OPTIONAL MATCH (:User)-[like:LIKE]->(:Post)-[:IS_LOCATED]->(place)
          RETURN COUNT(DISTINCT like) AS placeLikeCount   // return count
      }
      
      // post comments and comment authors
      CALL {
          WITH post
          OPTIONAL MATCH (commentAuthor:User)-[:CREATED]->(comment:Comment)-[:BELONGS_TO]->(post)
          RETURN commentAuthor, comment
          ORDER BY comment.createdAt DESC // sort by newest
          SKIP 0
          LIMIT 100
      }
      
      // total number of post likes
      CALL {
          WITH post
          OPTIONAL MATCH (like:User)-[:LIKE]->(post)
          RETURN COUNT(like) AS likeCount // return count
      }
      
      // total number of post comments
      CALL {
          WITH post
          OPTIONAL MATCH (comment:Comment)-[:BELONGS_TO]->(post)
          RETURN COUNT(comment) AS commentCount   // return count
      }
      
      // user like type
      // return type of like when user liked, otherwise return null
      CALL {
          WITH user, post
          OPTIONAL MATCH (user)-[like:LIKE]->(post)
          RETURN like.type AS liked    // return like type such as 👍, ❤, etc.
      }
      
      // same as post like, but with post comment
      CALL {
          WITH user, comment
          OPTIONAL MATCH (user)-[like:LIKE]->(comment)
          RETURN like.type AS likedComment    // return like type such as 👍, ❤, etc.
      }
      
      // post properties
      WITH
          commentCount, 
          post,
          liked,
          likeCount,
          photos: collect(DISTINCT photo{.*}),
      
          // post comments as an array of objects
          COLLECT(DISTINCT comment{.*,
              id: ID(comment),
              author: commentAuthor{.*,
                  id: ID(commentAuthor),
                  profileUrl: "https://avatars.dicebear.com/api/initials/" + commentAuthor.firstName + "%20" + commentAuthor.lastName + ".svg"
              },
              liked: likedComment
          }) AS comments,
      
          // author as an object
          author{.*,
              id: ID(author),
              profileUrl: "https://avatars.dicebear.com/api/initials/" + author.firstName + "%20" + author.lastName + ".svg"
          } AS author,
      
          // place post is located in as an object
          place{.*,
              id: ID(place),
              postCount: placePostsCount,
              latitude: place.location.x,
              longitude: place.location.y,
              likeCount: placeLikeCount
          } AS place
          
      
      // return posts as an array of post objects 
      RETURN COLLECT(DISTINCT post{.*,    // all properties of post node
          id: ID(post),   // post id
          likeCount,  // total number of post likes
          commentCount,   // total number of post comments
          comments,   // post comments
          author, // post author
          place,  // place post is located in
          photos,  // photos in post
          liked   // type of liked if user is logged in
      }) AS posts`;

  const [result] = await RunCypherQuery({
    query,
    params: {
      loggedId: logged,
      // neo4j.int must be used for integer values
      skip: neo4j.int(skip),
      limit: neo4j.int(take > 100 ? 100 : take), // disable fetching more than 100 posts at once
    },
  });

  return result.records[0].get('posts');
};

export default PersonalizedPostsQuery;
