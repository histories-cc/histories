import { toast } from 'react-hot-toast';

export type UnlikePostProps = {
  localLikeState: boolean;
  setLocalLikeState: React.Dispatch<React.SetStateAction<boolean>>;
  id: number;
  unlikeMutation: any;
};

const UnlikePost = async ({
  localLikeState,
  setLocalLikeState,
  id,
  unlikeMutation,
}: UnlikePostProps): Promise<void> => {
  // try
  try {
    if (!localLikeState) return; // if user didn't like post before return

    setLocalLikeState(false); // change localLikeState

    await unlikeMutation({ variables: { id } }); // call graphql mutation
  } catch (error: any) {
    // throw error if mutation wasn't successful
    toast.error(error.message);
    // refetch data
    // (localStates will have wrong value)
    // (possibility that post was deleted)
    // await refetch();
  }
};

export default UnlikePost;
