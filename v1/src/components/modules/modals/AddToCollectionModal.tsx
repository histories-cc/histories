import { Button } from '@components/elements';
import { useAddToCollectionMutation } from '@graphql';
import { Dialog, Transition } from '@headlessui/react';
import MeContext from '@src/contexts/MeContext';
import React, { Fragment } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export type AddToCollectionModalProps = {
  postId: number;
  isOpen: boolean;
  setOpenState: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddToCollectionModal: React.FC<AddToCollectionModalProps> = ({
  postId,
  isOpen,
  setOpenState,
}) => {
  const meContext = React.useContext(MeContext);
  const [addToCollectionMutation] = useAddToCollectionMutation();
  const { t } = useTranslation();
  function OnClose() {
    setOpenState(false);
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={OnClose}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-900 opacity-50" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle bg-white shadow-xl transition-all transform rounded-2xl">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium text-gray-900 leading-6"
              >
                Add post to collection
              </Dialog.Title>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  <div className="px-4 mb-5 overflow-x-hidden overflow-y-auto grid grid-cols-3 gap-4">
                    {meContext.data?.me?.collections?.map((collection) => (
                      <div
                        key={collection?.name}
                        onClick={async () => {
                          try {
                            toast.success(
                              t('post_saved_to') + ' ' + collection?.name ??
                                t('collection')
                            );
                            await addToCollectionMutation({
                              variables: {
                                postId,
                                collectionId: collection!.id,
                              },
                            });
                            setOpenState(false);
                          } catch (error: any) {
                            toast.error(error.message);
                          }
                        }}
                        className="text-center"
                      >
                        <div className="w-full h-20 m-auto bg-gray-300 hover:bg-gray-400 rounded-xl"></div>
                        {collection?.name}
                      </div>
                    ))}
                  </div>
                </p>
              </div>

              <div className="flex mt-4 gap-2">
                <Button onClick={OnClose}>Exit</Button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddToCollectionModal;
