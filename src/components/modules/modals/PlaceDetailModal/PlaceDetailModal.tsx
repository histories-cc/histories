import { usePlaceDetailModalQuery } from '@graphql';
import { Dialog, Transition } from '@headlessui/react';
import UrlPrefix from '@src/constants/IPFSUrlPrefix';
import Image from 'next/image';
import React, { Fragment } from 'react';
import { Blurhash } from 'react-blurhash';
import { useTranslation } from 'react-i18next';

import PlaceDetailModalProps from './props';
import PlaceDetailModalRightSide from './RightPanel';

// todo: resolve placeholders
// just don't use placeholders from parameters xd
const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({
  id,
  isOpen,
  setIsOpen,
}) => {
  const { data } = usePlaceDetailModalQuery({
    variables: { id },
  });
  const { t } = useTranslation<string>(); // i18n

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className="min-h-screen px-4 text-center">
          <Dialog.Overlay className="fixed inset-0 bg-gray-900 opacity-50" />

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
            <div className="inline-block w-full p-6 my-8 overflow-hidden align-middle bg-white shadow-xl h-[80vh] transition-all transform rounded-xl">
              <div className="w-full h-full grid grid-cols-[auto_auto] gap-2">
                <div className="relative h-full w-[60vw]">
                  {data?.place?.preview?.blurhash && (
                    <Blurhash
                      hash={data.place.preview.blurhash}
                      height="100%"
                      width="100%"
                      className="rounded-xl blurhash"
                      punch={1}
                    />
                  )}
                  <Image
                    src={UrlPrefix + data?.place.preview?.hash}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-xl"
                    alt={t('place_preview')}
                  />
                </div>
                {data?.place && (
                  <PlaceDetailModalRightSide place={data.place} />
                )}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PlaceDetailModal;
