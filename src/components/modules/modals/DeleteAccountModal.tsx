import { useDeleteUserMutation } from '@graphql';
import { Dialog, Transition } from '@headlessui/react';
import { IDeleteAccountFormInput } from '@src/types/forms';
import { IModalProps } from '@src/types/props';
import { useRouter } from 'next/router';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Cookie from 'js-cookie';

const DeleteAccountModal: React.FC<IModalProps> = ({ isOpen, setIsOpen }) => {
  // hooks
  const [deleteMutation] = useDeleteUserMutation();
  const { register, handleSubmit } = useForm<IDeleteAccountFormInput>();
  const router = useRouter();

  const OnSubmit: SubmitHandler<IDeleteAccountFormInput> = async (data) => {
    try {
      await deleteMutation({
        variables: {
          password: data.password,
        },
      });

      Cookie.remove('session');

      router.push('/');

      setIsOpen(false);
    } catch (err) {}
  };

  return (
    <>
      <Transition appear show={isOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Delete account
                  </Dialog.Title>
                  <form
                    className="mt-2 flex flex-col"
                    onSubmit={handleSubmit(OnSubmit)}
                  >
                    {/* PASSWORD */}
                    <label className="label">password</label>
                    <input
                      type="password"
                      {...register('password', { required: true })}
                      className="text-input"
                    />
                  </form>

                  <div className="mt-4">
                    <button className="btn-danger">Delete account</button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default DeleteAccountModal;
