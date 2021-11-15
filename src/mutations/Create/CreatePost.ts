import { NSFWCheck } from '../../functions';
import DbConnector from '../../database/driver';

const CreatePost = async ({
  userID,
  description,
  hashtags,
  photoDate,
  longitude,
  latitude,
  url,
}: {
  userID: number;
  description: string;
  hashtags: string;
  photoDate: string;
  longitude: number;
  latitude: number;
  url: Array<{ url: string; blurhash: string }>;
}): Promise<string> => {
  // check every image in an array with NSFW api
  // if any of images is NSFW set `post.nsfw = true` and `post.public = false` by default
  const isNSFW = (
    await Promise.all(
      url.map(async (x) => {
        const res = await NSFWCheck(x.url);
        // if NSFW probability is more than 0.8 out of 1 return NSFW as true
        return res !== undefined && res > 0.8;
      })
    )
  ).find((x) => x); // check if there is any true in an array

  const query = `MATCH (user:User)
  WHERE ID(user) = ${userID} 
  CREATE (user)-[:CREATED]->(post:Post
  {
    description: "${description}",
    createdAt: ${new Date().getTime()},
    postDate: ${photoDate},
    url: ${JSON.stringify(url.map((x) => x.url))},
    blurhash: ${JSON.stringify(url.map((x) => x.blurhash))},
    nsfw: ${isNSFW ?? false}, 
    edited: false,
    public: ${!(isNSFW ?? false)}
  })
  MERGE (place:Place {    
    location: point({longitude: ${longitude}, latitude: ${latitude}, srid: 4326})
  })
  MERGE (post)-[:IS_LOCATED]->(place)
  RETURN post{.*, id: ID(post)} as post`;

  const driver = DbConnector();
  const session = driver.session();

  const postID = await (await session.run(query)).records[0].get('post').id;

  await session.run(`WITH ${hashtags} AS tags
  MATCH (user:User), (post:Post)
  WHERE ID(post) = ${postID} AND ID(user) = ${userID} AND (user:User)-[:CREATED]->(post:Post)
  FOREACH (tag IN tags |
  MERGE (hashtag:Hashtag {name:tag})
  MERGE (hashtag)-[:CONTAINS]->(post)
  )`);

  driver.close();

  return 'post created';
};

export default CreatePost;
