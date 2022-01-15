import PostPhoto from '../../../../types/PostPhoto';
import UrlPrefix from '../../../../shared/config/UrlPrefix';
import DbConnector from '../../../database/driver';
import { NSFWCheck } from '../../../functions';
import RunCypherQuery from '../../../database/RunCypherQuery';
import { InputMaybe } from '../../../../.cache/__types__';
import neo4j from 'neo4j-driver';

type CreatePostInput = {
  userID: number;
  description?: InputMaybe<string>;
  hashtags?: InputMaybe<string>;
  photoDate: string;
  nsfw: boolean;

  coordinates: {
    longitude: number;
    latitude: number;
  };

  photos: Array<{
    width: number;
    height: number;
    index: number;
    hash: string;
    blurhash: string;
  }>;
};

async function CreatePost({
  userID,
  description,
  hashtags,
  photoDate,
  coordinates,
  nsfw,
  photos,
}: CreatePostInput): Promise<string> {
  const [result] = await RunCypherQuery({
    query: `
    MATCH (user:User)         // match user
    WHERE ID(user) = $userID
  
    CREATE (user)-[:CREATED]->(post:Post
    {
      description: $description,
      createdAt: $createdAt, // date of post creation
      postDate: $postDate,  
      nsfw: $nsfw, 
      edited: false,
      public: $public
    })
    MERGE (place:Place {    
      location: point({longitude: $longitude, latitude: $latitude, srid: 4326})
    })
    MERGE (post)-[:IS_LOCATED]->(place)
  
    ${
      // connect properties from array to one string
      photos
        .map(
          (photo) => `
        // create photos and connect to post
        MERGE (post)-[:CONTAINS]->(:Photo {
          index: ${photo.index},
          hash: "${photo.hash}",
          blurhash: "${photo.blurhash}",
          width: ${photo.width},
          height: ${photo.height}
        })
      `
        )
        .join('\n')
    }
  
    RETURN post{.*, id: ID(post)} as post
    `,
    params: {
      userID,
      description,
      createdAt: new Date(0).getTime(),
      postDate: new Date(photoDate).getTime(),
      nsfw,
      public: !nsfw,
      longitude: coordinates.longitude,
      latitude: coordinates.latitude,
      photos,
    },
  });

  console.log(result.records[0]);

  const driver = DbConnector();
  const session = driver.session();

  const postID = result.records[0].get('user');
  /*
  await session.run(`WITH ${hashtags} AS tags
  MATCH (user:User), (post:Post)
  WHERE ID(post) = ${postID} AND ID(user) = ${userID} AND (user:User)-[:CREATED]->(post:Post)
  FOREACH (tag IN tags |
  MERGE (hashtag:Hashtag {name:tag})
  MERGE (hashtag)-[:CONTAINS]->(post)
  )`);
*/
  driver.close();

  return 'success';
}

export default CreatePost;
