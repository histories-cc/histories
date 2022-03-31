import { EditPostInput } from '../../../../../src/graphql/index';
import RunCypherQuery from '../../../../database/RunCypherQuery';

interface IEditPostProps extends EditPostInput {
  userID: number;
}

const EditPost = async (props: IEditPostProps) => {
  const query = `
        MATCH (user:User {id: ${props.userID}}), (post:Post {id: ${props.id}})
        ${
          props.description != null
            ? `SET post.description = "${props.description}"`
            : ''
        }
        ${
          props.startYear != null
            ? `SET post.startYear = ${props.startYear}`
            : ''
        }
        ${
          props.startMonth != null
            ? `SET post.startMonth = ${props.startMonth}`
            : ''
        }
        ${props.startDay != null ? `SET post.startDay = ${props.startDay}` : ''}
        ${props.endYear != null ? `SET post.endYear = ${props.endYear}` : ''}
        ${props.endMonth != null ? `SET post.endMonth = ${props.endMonth}` : ''}
        ${props.endDay != null ? `SET post.endDay = ${props.endDay}` : ''}
        ${
          props.nsfw != null
            ? `SET post.nsfw = CASE WHEN user.isAdmin THEN ${props.nsfw} ELSE post.nsfw END`
            : ''
        }
        ${props.hashtags != null ? `SET post.hashtags = ${props.hashtags}` : ''}
        ${props.latitude != null ? `SET post.latitude = ${props.latitude}` : ''}
        ${
          props.longitude != null
            ? `SET post.longitude = ${props.longitude}`
            : ''
        }
        RETURN post
    `;

  const [result] = await RunCypherQuery({ query });

  return 'success';
};

export default EditPost;
