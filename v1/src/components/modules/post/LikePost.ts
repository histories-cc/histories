import { toast } from 'react-hot-toast';

export type LikePostProps = {
  localLikeState: boolean;
  setLocalLikeState: React.Dispatch<React.SetStateAction<boolean>>;
  id: number;
  likeMutation: any;
};

const LikePost = async ({
  likeMutation,
  localLikeState,
  setLocalLikeState,
  id,
}: LikePostProps): Promise<void> => {
  // try
  try {
    if (localLikeState) return; // if user already liked post before return
    setLocalLikeState(true); // change localLikeState
    await likeMutation({ variables: { id, type: 'like' } }); // call graphql mutation
  } catch (error: any) {
    // throw error if mutation wasn't successful
    toast.error(error.message);
    // refetch data
    // (localStates will have wrong value)
    // (possibility that post was deleted)
    // await refetch();
  }
};

export default LikePost;
