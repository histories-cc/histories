import { IsValidUsername } from '../../../../../shared/validation/InputValidation';
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

const UserQuery = async ({
  logged,
  username,
  id,
}: {
  logged?: number;
  username?: string;
  id?: number;
}) => {
  // if username and id are undefined
  if (username == null && id == undefined)
    throw new Error('Username or id required');

  if (!IsValidUsername(username || '')) throw new Error('Invalid username');

  const query = `WITH ${logged || 'null'} AS loggedID
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
  OPTIONAL MATCH (comment:Comment)-[:BELONGS_TO]->(post)
  RETURN COUNT(DISTINCT post) AS postCount, COUNT(DISTINCT comment) AS commentCount // count them
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
      author: user{.*},
      commentCount,
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
  if (result.records[0] === undefined) return null;
  // else
  else return result.records[0].get('user') as queryResult;
};

export default UserQuery;
