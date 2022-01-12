import PostPhoto from '../../../../types/PostPhoto';
import UrlPrefix from '../../../../shared/config/UrlPrefix';
import DbConnector from '../../../database/driver';
import { NSFWCheck } from '../../../functions';
import RunCypherQuery from '../../../database/RunCypherQuery';
import { InputMaybe } from '../../../../.cache/__types__';

type CreatePostInput = {
  userID: number;
  description?: InputMaybe<string>;
  hashtags?: InputMaybe<string>;
  photoDate: string;
  longitude: number;
  latitude: number;
  photos: Array<PostPhoto>;
};

async function ContainsNSFW(photos: Array<PostPhoto>): Promise<boolean> {
  // check every image in an array with NSFW api
  // if any of images is NSFW set `post.nsfw = true` and `post.public = false` by default
  const containsNSFW = (
    await Promise.all(
      photos.map(async (photo) => {
        const res = await NSFWCheck(UrlPrefix + photo.hash);
        // if NSFW probability is more than 0.8 out of 1 return NSFW as true
        return res !== undefined && res > 0.8;
      })
    )
  ).find((x) => x); // check if there is any true in an array

  return containsNSFW ?? false;
}

async function CreatePost({
  userID,
  description,
  hashtags,
  photoDate,
  longitude,
  latitude,
  photos,
}: CreatePostInput): Promise<string> {
  const containsNSFW = false; // await ContainsNSFW(photos);

  const query = `
  MATCH (user:User)         // match user
  WHERE ID(user) = ${userID} 

  CREATE (user)-[:CREATED]->(post:Post
  {
    description: $description,
    createdAt: ${new Date().getTime()}, // date of post creation
    postDate: ${photoDate},  
    nsfw: false, 
    edited: false,
    public: true
  })
  MERGE (place:Place {    
    location: point({longitude: ${longitude}, latitude: ${latitude}, srid: 4326})
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

  RETURN post{.*, id: ID(post)} as post`;

  console.log(query);

  const [result] = await RunCypherQuery({
    query,
    params: {
      userID,
      description: description ?? '',
      nsfw: containsNSFW,
      public: !containsNSFW,
    },
  });

  const driver = DbConnector();
  const session = driver.session();

  const postID = await (
    await session.run(query, {
      blurhash: JSON.stringify(photos.map((x) => x.blurhash)),
    })
  ).records[0].get('post').id;

  await session.run(`WITH ${hashtags} AS tags
  MATCH (user:User), (post:Post)
  WHERE ID(post) = ${postID} AND ID(user) = ${userID} AND (user:User)-[:CREATED]->(post:Post)
  FOREACH (tag IN tags |
  MERGE (hashtag:Hashtag {name:tag})
  MERGE (hashtag)-[:CONTAINS]->(post)
  )`);

  driver.close();

  return 'post created';
}

export default CreatePost;
