import neo4j from 'neo4j-driver';

import { Maybe, PostsFilter } from '../../../../.cache/__types__';
import RunCypherQuery from '../../../database/RunCypherQuery';

type queryInput = {
  filter?: Maybe<PostsFilter>;
  loggedId: number | null;
};

const PostsQuery = async ({ filter, loggedId }: queryInput) => {
  const query = ` 
WITH $loggedId AS loggedID
MATCH (author:User)-[:CREATED]->(post:Post)-[:IS_LOCATED]->(place:Place)${
    filter?.collectionId
      ? `, (collection:Collection {id:${filter.collectionId}})-[:CONTAINS]->(post)`
      : ''
  }
WHERE (place.location.latitude >= $minLatitude OR $minLatitude IS NULL)                 // min latitude
  AND (place.location.latitude <= $maxLatitude OR $maxLatitude IS NULL)                 // max latitude
  AND (place.location.longitude >= $minLongitude OR $minLongitude IS NULL)              // min longitude
  AND (place.location.longitude <= $maxLongitude OR $maxLongitude IS NULL)              // max longitude
  AND (distance(place.location, point($radius)) <= $radius.distance OR $radius IS NULL) // radius 
  AND (ID(place) = $placeId OR $placeId IS NULL)                                        // place id
  AND (author.id = $authorId OR $authorId IS NULL)                                      // author id
  AND (author.username =~ $authorUsername OR $authorUsername IS NULL)                   // author id
  AND NOT ID(place) IN $exclude                                                         // object id is not in exclude

OPTIONAL MATCH(logged:User {id: loggedID}) // optionally match logged use

// post author followers and following and likes
CALL {
    WITH post
    OPTIONAL MATCH (author)-[:FOLLOW]->(following:User)  // match users who are followed by author
    OPTIONAL MATCH (follower:User)-[:FOLLOW]->(author)  // match users who follow author
    OPTIONAL MATCH (userLiked:User)-[:LIKE]->(post)  // match users who liked post

    RETURN  following,
            follower,
            COUNT(follower) AS followerCount,
            COUNT(following) AS followingCount,
            COLLECT(DISTINCT userLiked{.*}) AS likes,
            COUNT(userLiked) AS likeCount  // return number
}    
  
// post photos
CALL {
    WITH post
    MATCH (post)-[:CONTAINS]->(photo:Photo)
    RETURN COLLECT(DISTINCT photo{.*}) AS photos
}

WITH post{.*,
    likeCount,
    likes,  // users  who liked
    liked:  CASE
                WHEN loggedID IS NULL   
                    THEN false                              // when there is no logged user return false
                    ELSE EXISTS((logged)-[:LIKE]->(post))   // check if exists :LIKE relation
            END,
    followerCount,
    followingCount,
    author: author{.*}, // author object
    photos, // post photos array
    place: place{.*,
        latitude: place.location.latitude,  // latitude
        longitude: place.location.longitude // longitude
    }
} AS postObject
${''}
SKIP $skip
LIMIT $take

RETURN COLLECT(DISTINCT postObject) AS posts
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
      exclude: [],
    },
  });

  return result.records[0].get('posts');
};

export default PostsQuery;
