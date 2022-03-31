import { Button, Input } from '@components/elements';
import { useEditPlaceMutation } from '@graphql';
import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface IEditPlaceModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  preview?: string | null;
  name?: string | null;
  description?: string | null;
  id: number;
  refetch?: any;
}

interface IFormInput {
  name: string;
  description: string;
}

const EditPlaceModal: React.FC<IEditPlaceModalProps> = ({
  isOpen,
  setIsOpen,
  preview,
  name,
  description,
  id,
  refetch,
}) => {
  const [EditPlaceMutation] = useEditPlaceMutation();
  const { t } = useTranslation();
  function OnClose() {
    setIsOpen(false);
  }
  const { register, handleSubmit, reset } = useForm<IFormInput>();

  useEffect(() => {
    reset({
      name: name || '',
      description: description || '',
    });
  }, [name, description, preview]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
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
            <form
              className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle bg-white shadow-xl transition-all transform rounded-2xl"
              onSubmit={handleSubmit(async (data: IFormInput) => {
                EditPlaceMutation({
                  variables: {
                    input: {
                      id,
                      name: data.name,
                      description: data.description,
                    },
                  },
                });
                if (refetch !== undefined) await refetch();
                OnClose();
              })}
            >
              <Dialog.Title
                as="h3"
                className="text-lg font-medium text-gray-900 leading-6"
              >
                {t('edit_place')}
              </Dialog.Title>
              <div className="mt-2">
                <Input register={register} name="name" label={t('name')} />
                <Input
                  register={register}
                  name="description"
                  label={t('description')}
                />
              </div>

              <div className="flex mt-4 gap-2">
                <Button>{t('submit')}</Button>
              </div>
            </form>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditPlaceModal;
