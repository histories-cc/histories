import { Photo } from '../../../.cache/__types__';

type PostProps = {
  author: {
    firstName: string;
    lastName: string;
    username: string;
    profile: string;
    id: number;
  };
  timeline?: boolean;
  photos?: Array<Photo>;
  createdAt: number;
  description?: string;
  likeCount: number;
  commentCount: number;
  postDate: number;
  liked: string | null;
  refetch: () => Promise<void>;
  id: number;
};

export default PostProps;
