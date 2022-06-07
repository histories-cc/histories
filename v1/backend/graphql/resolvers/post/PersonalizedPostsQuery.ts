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
  const query = ` 
            MATCH (place:Place)<-[:IS_LOCATED]-(post:Post)<-[:CREATED]-(author:User), (post)-[:CONTAINS]->(photo:Photo), (user:User)
 
          ${
            logged !== null
              ? 'WHERE (((user)-[:FOLLOW]->(author)) OR (user = author)) AND ID(user) = $loggedID'
              : ''
          }
        
            CALL {
                WITH post
                OPTIONAL MATCH (:User)-[r:LIKE]->(post)  // match users who liked post
                RETURN COUNT(r) AS likeCount  // return number
            }
            
            CALL {
                WITH post
                OPTIONAL MATCH (:User)-[r:FOLLOW]->(author)  // match users who follow author
                RETURN COUNT(r) AS followerCount  // return number
            }
            
            CALL {
                WITH post
                OPTIONAL MATCH (author)-[r:FOLLOW]->(:User)  // match users who are followed by author
                RETURN COUNT(r) AS followingCount  // return number
            }    
          
            CALL {
                WITH post
                MATCH (post)-[:CONTAINS]->(photo:Photo)
                RETURN COLLECT(DISTINCT photo{.*}) AS photos
            }

            // number of posts in place
            CALL {
                WITH place
                MATCH (post:Post)-[:IS_LOCATED]->(place)
                RETURN COUNT(DISTINCT post) AS placePostsCount  // return count
            }

            // total number of post comments
            CALL {
                WITH post
                OPTIONAL MATCH (comment:Comment)-[:BELONGS_TO]->(post)
                RETURN COUNT(DISTINCT comment) AS commentCount   // return count
            }
 
            WITH post{.*,
              id: ID(post),
              likeCount,
              liked: ${logged ? 'EXISTS((user)-[:LIKE]->(post))' : 'false'},
              followerCount,
              followingCount,
              commentCount,   // total number of post comments
              author: author{.*,id: ID(author)},
              photos,
              place: place{.*, 
                  id: ID(place),
                  latitude: place.location.latitude,  // latitude
                  longitude: place.location.longitude,    // longitude
                  postCount: placePostsCount
              }
          } AS post

            RETURN COLLECT(DISTINCT post)[$skip..$skip + $take] // limit array 
            AS posts `;

  const [result] = await RunCypherQuery({
    query,
    params: {
      loggedID: logged,
      // neo4j.int must be used for integer values
      skip: neo4j.int(skip),
      take: neo4j.int(take > 100 ? 100 : take), // disable fetching more than 100 posts at once
    },
  });

  return result.records[0].get('posts');
};

export default PersonalizedPostsQuery;
