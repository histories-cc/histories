import { ValidateUsername } from '../../../../../shared/validation';
import RunCypherQuery from '../../../../database/RunCypherQuery';

type queryResult = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  bio: string | null;
  verified: boolean;
  created: number;
  following?: {
    id: number;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    bio: string | null;
  };
  followers?: {
    id: number;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    bio: string | null;
  };
  posts?: {
    id: number;
    description: string;
  };
};

// QUERY
/*
 * - using OPTIONAL MATCH in subqueries because when there is not match and it wouldn't be optional whole query would just return nothing
 *
 *
 * WITH 13 AS loggedID            // save logged user as loggedID (if not logged save null)
 * MATCH (user:User)
 * WHERE ID(user) = 54            // match user node by ID (or by username -> WHERE user.username =~ "(?i)krystofex" (not case sensitive))
 * CALL {                                                   // subquery
 *     WITH user                                            // define subquery variables
 *     OPTIONAL MATCH (user)-[created:CREATED]->(post:Post)-[:IS_LOCATED]->(place:Place)
 *     RETURN post, place
 *     ORDER BY post.createdAt DESC                         // order by time when post was created
 *     LIMIT 100
 * }
 * CALL {                                                   // subquery
 *     WITH user                                            // define subquery variables
 *     OPTIONAL MATCH (user)-[:FOLLOW]->(following:User)
 *     RETURN following
 *     LIMIT 100
 * }
 * CALL {                                                   // subquery
 *     WITH user                                            // define subqeury variables
 *     OPTIONAL MATCH (follower:User)-[:FOLLOW]->(user)
 *     RETURN follower
 *     LIMIT 100
 * }
 * CALL {                                                   // subquery
 *     WITH user                                            // define subquery variables
 *     OPTIONAL MATCH (user)-[:CREATED]->(collection:Collection)
 *     RETURN DISTINCT collection
 *     LIMIT 100
 * }
 * CALL {                                                   // subquery
 *     WITH user, loggedID                                  // define subquery variables
 *     OPTIONAL MATCH (logged:User)-[r:FOLLOW]->(user)
 *     WHERE ID(logged) = loggedID
 *     RETURN r AS isFollowing                              // returns all relations (should be only one)
 * }
 *
 * RETURN user{.*,                    - all user properties
 *     id: ID(user),                  - user ID
 *     posts: COLLECT(DISTINCT post{.*,                 // return posts as an array (every post just once)
 *                                id: ID(post),         // post ID
 *                                place:place{.*,       // return place post is assigned to as an post property
 *                                  id: ID(place)}      // place ID
 *                                }
 *     ),
 *     followers: COLLECT(DISTINCT follower{.*,         // return followers as an array (every follower just once)
 *                                    id: ID(follower)  // follower ID
 *                                 }
 *     ),
 *     following: COLLECT(DISTINCT following{.*,        // return users followed by user as an array (every follower just once)
 *                                    id: ID(following) // followings ID
 *                                 }
 *     ),
 *     collections: COLLECT(DISTINCT collection{.*,
 *                                      id: ID(collection)
 *                                   }
 *     ),
 *     isFollowing: COUNT(DISTINCT isFollowing) > 0     // number of FOLLOW relations between logged user and user, returns boolean
 * } AS user
 */

const UserQuery = async ({
  logged,
  username,
  id,
}: {
  logged?: number;
  username?: string;
  id?: number;
}): Promise<queryResult> => {
  // if username and id are undefined
  if (username === undefined && id === undefined)
    throw new Error('Username or id required');

  // if username is defined validate username
  if (username) {
    const validateUsername = ValidateUsername(username).error;
    if (validateUsername) throw new Error(validateUsername);
  }

  const query = `WITH ${logged ?? 'null'} AS loggedID
MATCH (user:User)
${
  // if id is defined match by id
  // else if only username is defined match by username
  id !== undefined
    ? ` WHERE ID(user) = ${id} `
    : ` WHERE user.username =~ "(?i)${username}" `
}

CALL {
  WITH user
  OPTIONAL MATCH (user)-[created:CREATED]->(postTmp:Post)-[:IS_LOCATED]->(place:Place)
  RETURN DISTINCT postTmp, place
  ORDER BY postTmp.createdAt DESC
}

// POST COUNT
CALL {
  WITH user
  OPTIONAL MATCH (user)-[:CREATED]->(post:Post) // get all users posts
  RETURN COUNT(DISTINCT post) AS postCount      // count them
}

CALL {
  WITH postTmp
  RETURN postTmp as post
  SKIP 0
  LIMIT 50
}

CALL {
  WITH post
  OPTIONAL MATCH (post)-[:CONTAINS]->(photo:Photo)
  RETURN COLLECT(DISTINCT photo{.*}) AS photos
}


CALL {
  WITH user
  OPTIONAL MATCH (user)-[:FOLLOW]->(following:User)
  RETURN DISTINCT following
  LIMIT 5000
}

CALL {
  WITH user
  OPTIONAL MATCH (user)-[:FOLLOW]->(following:User)
  RETURN COUNT(DISTINCT following) AS followingCount
}

CALL {
  WITH user
  OPTIONAL MATCH (follower:User)-[:FOLLOW]->(user)
  RETURN DISTINCT follower
  LIMIT 5000
}

CALL {
  WITH user
  OPTIONAL MATCH (follower:User)-[:FOLLOW]->(user)
  RETURN COUNT(DISTINCT follower) AS followerCount 
}

CALL {
  WITH user
  OPTIONAL MATCH (user)-[:CREATED]->(collection:Collection)
  RETURN DISTINCT collection
}

CALL {
  WITH user, loggedID
  OPTIONAL MATCH (logged:User)-[r:FOLLOW]->(user)
  WHERE ID(logged) = loggedID
  RETURN r AS isFollowing
}

RETURN user{.*, id: ID(user),
  posts: COLLECT(DISTINCT post{.*,
      photos,
      id: ID(post),
      author: user{.*,
          id: ID(user)
      },
      place:place{.*,
          latitude: place.location.latitude,
          longitude: place.location.longitude,
          id: ID(place)}
      }),
  followingCount,
  // if user doesn't have a profile picture return link to api with generated pictures
  profile:  CASE WHEN (user.profile IS NOT NULL) 
              THEN user.profile
              ELSE "https://avatars.dicebear.com/api/initials/" + user.firstName + "%20" + user.lastName + ".svg"
            END,
  followerCount,
  postCount,
  followers: COLLECT(DISTINCT follower{.*,
                                  id: ID(follower)
                              }), 
  following: COLLECT(DISTINCT following{.*,
                                  id: ID(following)
                              }),
  collections: COLLECT(DISTINCT collection{.*,
                                  id: ID(collection)
                              }),
  isFollowing: COUNT(DISTINCT isFollowing) > 0
} AS user`;

  const [result] = await RunCypherQuery({ query });

  // If user doesn't exist
  if (result.records[0] === undefined) throw new Error('User does not exist');
  // else
  else return result.records[0].get('user') as queryResult;
};

export default UserQuery;
