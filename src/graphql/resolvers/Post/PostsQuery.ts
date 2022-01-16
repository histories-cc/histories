import RunCypherQuery from '../../../database/RunCypherQuery';
import neo4j from 'neo4j-driver';

type queryInput = {
  filter: {
    placeId?: number;
    authorId?: number;
    authorUsername?: string;
    maxLatitude: number | null;
    minLatitude: number | null;
    maxLongitude: number | null;
    minLongitude: number | null;
    minDate: number | null;
    maxDate: number | null;
    radius: {
      latitude: number;
      longitude: number;
      distance: number;
    } | null;
    tags: string[] | null;
    skip: number | null;
    take: number | null;
  } | null;
  loggedId: number | null;
};

const PlacesQuery = async ({ filter, loggedId }: queryInput) => {
  const query = `
  MATCH (place:Place)<-[:IS_LOCATED]-(post:Post)<-[:CREATED]-(author:User), (post)-[:CONTAINS]->(photo:Photo)
  WHERE (place.location.latitude >= $minLatitude OR $minLatitude IS NULL)                 // min latitude
    AND (place.location.latitude <= $maxLatitude OR $maxLatitude IS NULL)                 // max latitude
    AND (place.location.longitude >= $minLongitude OR $minLongitude IS NULL)              // min longitude
    AND (place.location.longitude <= $maxLongitude OR $maxLongitude IS NULL)              // max longitude
    AND (distance(place.location, point($radius)) <= $radius.distance OR $radius IS NULL) // radius 
    AND (ID(place) = $placeId OR $placeId IS NULL)                                        // place id
    AND (author.id = $authorId OR $authorId IS NULL)                                      // author id
    AND (author.username =~ $authorUsername OR $authorUsername IS NULL)                   // author id

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

    RETURN COLLECT(DISTINCT post{.*,
        id: ID(post),
        likeCount,
        followerCount,
        followingCount,
        author: author{.*,id: ID(author)},
        photos,
        place: place{.*, 
            id: ID(place),
            latitude: place.location.latitude,  // latitude
            longitude: place.location.longitude    // longitude
        }
    })[$skip..$skip + $take] // limit array 
    AS posts 
  `;

  const [result] = await RunCypherQuery({
    query,
    params: {
      // if parameter is undefined set it to null
      minLatitude: filter?.minLatitude ?? null,
      maxLatitude: filter?.maxLatitude ?? null,
      minLongitude: filter?.minLongitude ?? null,
      maxLongitude: filter?.maxLongitude ?? null,
      minDate: filter?.minDate ?? null,
      maxDate: filter?.maxDate ?? null,
      skip: neo4j.int(filter?.skip ?? 0),
      take: neo4j.int(filter?.take ?? 5000),
      radius: filter?.radius ?? null,
      loggedId,
      authorId: filter?.authorId ?? null,
      authorUsername: filter?.authorUsername
        ? `(?i)${filter.authorUsername}`
        : null,
      placeId: filter?.placeId ?? null,
    },
  });

  return result.records[0].get('posts');
};

export default PlacesQuery;
