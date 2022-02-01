import { Button } from '@components/Elements';
import { Dialog, Transition } from '@headlessui/react';
import { t } from 'i18next';
import React, { Fragment } from 'react';

interface DeleteCollectionModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm?: () => void;
}

const DeleteCollectionModal: React.FC<DeleteCollectionModalProps> = ({
  isOpen,
  setIsOpen,
  onConfirm,
}) => {
  function OnClose() {
    setIsOpen(false);
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
                Delete collection
              </Dialog.Title>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  This will not delete any posts you, or someone else created.
                </p>
              </div>

              <div className="flex mt-4 gap-2">
                <Button onClick={OnClose}>Exit</Button>
                <Button style="danger_solid" onClick={onConfirm}>
                  {t('delete_collection')}
                </Button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DeleteCollectionModal;
