import neo4j from 'neo4j-driver';

import { Maybe, PlacesFilter } from '../../../../src/graphql/index';
import RunCypherQuery from '../../../database/RunCypherQuery';

type PlacesQueryInput = {
  filter?: Maybe<PlacesFilter>;
  loggedId: Maybe<number>;
};

const PlacesQuery = async ({ filter, loggedId }: PlacesQueryInput) => {
  const query = `
  MATCH (place:Place)
  WHERE (place.location.latitude >= $minLatitude OR $minLatitude IS NULL)                 // min latitude
    AND (place.location.latitude <= $maxLatitude OR $maxLatitude IS NULL)                 // max latitude
    AND (place.location.longitude >= $minLongitude OR $minLongitude IS NULL)              // min longitude
    AND (place.location.longitude <= $maxLongitude OR $maxLongitude IS NULL)              // max longitude
    AND (distance(place.location, point($radius)) <= $radius.distance OR $radius IS NULL) // radius 
    AND NOT place.id IN $exclude                                                         // object id is not in exclude

  // return most liked post from place which has photos
  CALL {
      WITH place
      OPTIONAL MATCH (place:Place)<-[:IS_LOCATED]-(post:Post)-[:CONTAINS]->(photo:Photo)
      RETURN photo
      LIMIT 1 // only one to use as preview image
  }
  
  // post count
  CALL {
      WITH place
      // count posts assigned to place
      OPTIONAL MATCH (place:Place)<-[:IS_LOCATED]-(post:Post)<-[:CREATED]-(author:User)
      RETURN COUNT(DISTINCT post) AS postCount 
  }
  
  // like count
  CALL {
      WITH place
      // count likes assigned to posts assigned to place
      OPTIONAL MATCH (place:Place)<-[:IS_LOCATED]-(:Post)<-[:LIKE]-(like:User)
      RETURN COUNT(DISTINCT like) AS likeCount    
  }
  // posts
  CALL {
      WITH place
      OPTIONAL MATCH (author:User)-[:CREATED]->(post:Post)-[:IS_LOCATED]->(place)
      RETURN COLLECT(DISTINCT post{.*, author: author{.*}}) AS posts
  }

  // place years
  CALL {
    WITH place
    OPTIONAL MATCH (place:Place)<-[:IS_LOCATED]-(post:Post)
    RETURN COLLECT(DISTINCT post.year) AS years
  }

  CALL {
  WITH place
    MATCH (photo:Photo)<-[:CONTAINS]-(post:Post)-[:IS_LOCATED]->(place), (n)-->(post)
    OPTIONAL MATCH (place)-[:HAS_PREVIEW]->(preview:Photo)
RETURN  COLLECT(n) AS photoRelations,
 photo AS placePreview, preview
ORDER BY SIZE(photoRelations) DESC
LIMIT 1
}
  
  // return places as an array of objects
  WITH place{.*,
    years,
    latitude: place.location.latitude,  // latitude
    longitude: place.location.longitude,    // longitude
    icon: place.icon,
    postCount,
    likeCount,
    posts,
      distance:  
          CASE
              // if radius in input is not defined return null
              WHEN $radius IS NULL THEN NULL
              // when searching in radius return distance from center
              ELSE distance(place.location, point($radius)) 
          END,
        preview:    CASE
                    WHEN preview IS NOT NULL 
                        THEN preview{.*}        // if there is a place preview
                        ELSE placePreview{.*}       // else select most popular photo
                    END
  } AS placeObj
  ORDER BY placeObj.id ASC
  SKIP $skip
  LIMIT $take

  RETURN COLLECT(placeObj) AS places
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
      exclude: filter?.exclude ? filter.exclude.map((id) => neo4j.int(id)) : [],
      radius: filter?.radius ?? null,
      loggedId,
    },
  });

  return result.records[0].get('places').map((place: any) => ({
    ...place,
    years: place.posts
      .map((post: { startYear: number; endYear: number }) => {
        let postYears = [];
        for (let i = post.startYear; i <= post.endYear; i++) postYears.push(i);
        return postYears;
      })
      .flat(2)
      .filter(
        (year: number, index: number, self: number[]) =>
          self.indexOf(year) === index
      ),
  }));
};

export default PlacesQuery;
