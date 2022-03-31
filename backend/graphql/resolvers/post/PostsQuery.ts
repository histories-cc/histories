import { Maybe, PostsFilter } from '../../../../src/graphql/index';
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
  AND (place.id = $placeId OR $placeId IS NULL)                                        // place id
  AND (author.id = $authorId OR $authorId IS NULL)                                      // author id
  AND (author.username =~ $authorUsername OR $authorUsername IS NULL)                   // author id
  AND NOT place.id IN $exclude                                                         // object id is not in exclude

OPTIONAL MATCH(logged:User {id: loggedID}) // optionally match logged use

// post author followers and following and likes
CALL {
    WITH post 
    OPTIONAL MATCH (userLiked:User)-[:LIKE]->(post)  // match users who liked post
    OPTIONAL MATCH (commentAuthor:User)-[:CREATED]->(comment:Comment)-[:BELONGS_TO]->(post)  // match comments of post

    RETURN  COLLECT(DISTINCT userLiked{.*}) AS likes,
            COUNT(DISTINCT userLiked) AS likeCount,  // return number
            COUNT(comment) AS commentCount,  // return number
            COLLECT(DISTINCT comment{.*, author: commentAuthor{.*}}) AS comments
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
    commentCount,   // number of comments on post
    // comments,
    author: author{.*}, // author object
    photos, // post photos array
    place: place{.*,
        latitude: place.location.latitude,  // latitude
        longitude: place.location.longitude // longitude
    }
} AS postObject

RETURN COLLECT(DISTINCT postObject)${
    filter?.skip != null || filter?.take != null
      ? `[${filter?.skip != null ? filter.skip : ''}..${
          filter?.take != null ? filter?.skip || 0 + filter.take : ''
        }]`
      : ''
  } AS posts
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
