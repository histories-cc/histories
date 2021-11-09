import DbConnector from '../database/driver';

// QUERY
/*
 * MATCH (place:Place)        // Find place by id
 * WHERE ID(place) = 32
 * CALL {                                                                         // Get all posts and authors
 *    WITH place                                                                  // Get place
 *    OPTIONAL MATCH (author:User)-[:CREATED]->(post:Post)-[:IS_LOCATED]->(place) // Get all posts and authors
 *    RETURN author, post                                                         // Return authors and posts
 *    LIMIT 100                                                                   // Limit to 100
 * }
 *
 * CALL {
 *    WITH place
 *    MATCH (:Post)-[:IS_LOCATED]->(nearby:Place)                                            // Get all places with some posts
 *    WHERE NOT place = nearby                                                               // Except original place
 *    RETURN nearby, round((distance(place.location, nearby.location)/1000), 3) AS distance  // Return places and distances from original place, rounded to 3 decimal places
 *    ORDER BY distance(place.location, nearby.location) ASC                                 // Order by distance ascending
 *    LIMIT 10                                                                               // Limit to 10
 *}
 *
 * RETURN place{.*,                        // Return place as object
 *    id:ID(place),                        // Return place id as id
 *    latitude: place.location.y,          // Return place latitude as latitude
 *    longitude: place.location.x,         // Return place longitude as longitude
 *    posts: COLLECT(DISTINCT post{.*,     // Return posts  as objects
 *          id:ID(post),                   // Return post id as id
 *          author: author{.*,             // Return author as object
 *              id: ID(author)             // Return author id as id
 *          }
 *        }),
 *    nearbyPlaces: COLLECT(DISTINCT nearby{.*, // Return nearby places as objects
 *          id:ID(nearby),                      // Return nearby place id as id
 *          distance                            // Return distance from original place as distance
 *          }
 *        )
 *    }
 *  } AS place`;
 *
 */

// RESPONSE
/*
 * {
 *  id: number,
 *  name: string,
 *  description: string,
 *  preview: string,
 *  latitude: number,
 *  longitude: number,
 *  posts: [
 *    {
 *     id: number,
 *     createdAt: string,
 *     postDate: string,
 *     author: {
 *      id: number,
 *      firstName: string,
 *      lastName: string,
 *      username: string,
 *     }
 *    }
 *  ]
 *  nearbyPlaces: {
 *    id: number,
 *    name: string,
 *    description: string,
 *    preview: string,
 *    distance: number,  // in km
 *  }
 * }
 */

const PlaceQuery = async ({ id }: { id: number }) => {
  const query = `  MATCH (place:Place)        // Find place by id
  WHERE ID(place) = ${id}
  CALL {                                                                          
     WITH place
     OPTIONAL MATCH (author:User)-[:CREATED]->(post:Post)-[:IS_LOCATED]->(place)  
     RETURN author, post
     LIMIT 100
  }
 CALL {
     WITH place
     MATCH (nearbyPost:Post)-[:IS_LOCATED]->(nearby:Place)                                             
     WHERE NOT place = nearby                                                               
     RETURN nearby, nearbyPost, round((distance(place.location, nearby.location)/1000), 3) AS distance  
     ORDER BY distance(place.location, nearby.location) ASC                                 
     LIMIT 10                                                                               
 }
 
CALL {
    WITH nearbyPost
    MATCH (n)-[r]->(nearbyPost)
    WHERE NOT(r:REPORT)
    RETURN COLLECT(n) AS numberOfN, COLLECT(nearbyPost) AS automaticPreview
    ORDER BY SIZE(numberOfN) DESC
    LIMIT 3
}

  RETURN place{.*,     
     id:ID(place),                         
     latitude: place.location.y,           
     longitude: place.location.x,          
     posts: COLLECT(DISTINCT post{.*,      
           id:ID(post),                    
           author: author{.*,              
               id: ID(author)              
           }
         }),
     nearbyPlaces: COLLECT(DISTINCT nearby{.*,  
           id:ID(nearby),  
     preview: CASE WHEN SIZE(nearby.preview) > 0 THEN nearby.preview ELSE automaticPreview[0].url[0] END,                    
           distance                             
           }
         )
     }
   AS place`;

  const driver = DbConnector();
  const session = driver.session();

  const result = await session.run(query);
  driver.close();

  return result.records[0].get('place');
};

export default PlaceQuery;
