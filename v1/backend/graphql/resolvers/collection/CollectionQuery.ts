import RunCypherQuery from '../../../database/RunCypherQuery';

const UserQuery = async ({
  logged,
  id,
}: {
  logged: number | null;
  id: number;
}): Promise<any> => {
  const query = `
  WITH ${logged || 'null'} AS loggedID
  MATCH (author:User)-[:CREATED]->(collection:Collection {id:${id}})

  CALL {
      WITH collection
      OPTIONAL MATCH (collection)-[:CONTAINS]->(post:Post)<-[:CREATED]-(postAuthor:User)
      RETURN post, postAuthor
      LIMIT 50
  }
  
  CALL {
    WITH collection
    OPTIONAL MATCH (collection)-[:CONTAINS]->(post)
    RETURN COUNT(DISTINCT post) AS postCount
  }

  CALL {
      WITH postAuthor
      OPTIONAL MATCH (follower:User)-[:FOLLOW]->(postAuthor)
      OPTIONAL MATCH (user)-[:FOLLOW]->(following:User)
      OPTIONAL MATCH (postAuthor)-[:FOLLOW]->(following:User)
      RETURN  COUNT(DISTINCT follower) AS postAuthorFollowerCount,
              COUNT(DISTINCT following) AS postAuthorFollowingCount
  }
   
  CALL {
      WITH author
      OPTIONAL MATCH (follower:User)-[:FOLLOW]->(author)
      OPTIONAL MATCH (author)-[:FOLLOW]->(following:User)
      RETURN COUNT(DISTINCT follower) AS followerCount,
          COUNT(DISTINCT following) AS followingCount
  }
  
  CALL {
    WITH author, loggedID
    OPTIONAL MATCH (logged:User)-[r:FOLLOW]->(author)
    WHERE logged.id = loggedID
    RETURN r AS isFollowing
  }
  
  RETURN collection{.*, 
          postCount,  
          posts: COLLECT(DISTINCT post{.*, 
                  author:
                      postAuthor{.*,
                      followerCount: postAuthorFollowerCount,
                      followingCount: postAuthorFollowingCount
                  }
              }),
          author: author{.*,
              followerCount,
              followingCount,
              isFollowing: COUNT(DISTINCT isFollowing) > 0,
              profile:  CASE WHEN (author.profile IS NOT NULL) 
                          THEN author.profile
                          ELSE "https://avatars.dicebear.com/api/initials/" + author.firstName + "%20" + author.lastName + ".svg"
                        END
          }
      } AS collection`;

  const [result] = await RunCypherQuery({ query, params: { id } });

  // If Collection doesn't exist
  if (result.records[0] == undefined) return null;
  // else
  else return result.records[0].get('collection');
};

export default UserQuery;
