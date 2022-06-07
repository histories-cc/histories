import DbConnector from '../../../database/driver';

const PlaceQuery = async ({ id }: { id: number }) => {
  const query = `  MATCH (place:Place)
WHERE place.id = $placeId
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

CALL {
  WITH place
    MATCH (photo:Photo)<-[:CONTAINS]-(post:Post)-[:IS_LOCATED]->(place), (n)-->(post)
    OPTIONAL MATCH (place)-[:HAS_PREVIEW]->(preview:Photo)
RETURN  COLLECT(n) AS photoRelations,
 photo AS placePreview, preview
ORDER BY SIZE(photoRelations) DESC
LIMIT 1
}

RETURN 
    place{.*,    
        preview:    CASE
                    WHEN preview IS NOT NULL 
                        THEN preview{.*}        // if there is a place preview
                        ELSE placePreview{.*}       // else select most popular photo
                    END,  
        latitude: place.location.y,           
        longitude: place.location.x,          
   posts: COLLECT(DISTINCT post{.*,               
         author: author{.*}
       }),
   nearbyPlaces: COLLECT(DISTINCT nearby{.*,  
   preview: CASE WHEN SIZE(nearby.preview) > 0 THEN nearby.preview ELSE automaticPreview[0].url[0] END,                    
         distance                             
         }
       )
   }
 AS place`;

  const driver = DbConnector();
  const session = driver.session();

  const result = await session.run(query, { placeId: id });
  driver.close();

  return result.records[0].get('place');
};

export default PlaceQuery;
