import { Menu, Transition } from '@headlessui/react';
import UrlPrefix from '@src/constants/IPFSUrlPrefix';
import MeContext from '@src/contexts/MeContext';
import LogOut from '@src/functions/LogOut';
import Image from 'next/image';
import Link from 'next/link';
import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import DropdownTransition from '../dropdown/DropdownTransition';

const UserDropdown: React.FC = () => {
  const meContext = React.useContext(MeContext);

  const { t } = useTranslation();

  return (
    <Menu as="div" className="relative">
      <Menu.Button
        as="div"
        className="flex items-center px-4 py-1 font-bold rounded-lg cursor-pointer gap-1 transition ease-in-out hover:bg-gray-200 dark:hover:bg-gray-800"
      >
        <div className="relative w-8 h-8 rounded-full">
          <Image
            className="rounded-full gray-400"
            src={
              // if user has a profile picture add IPFS gateway to hash
              meContext.data!.me!.profile.startsWith('http')
                ? meContext.data!.me!.profile
                : UrlPrefix + meContext.data!.me!.profile
            }
            layout="fill"
            objectFit="contain"
            objectPosition="center"
            alt="Profile picture"
            quality={20}
          />
        </div>
        <a className="font-semibold">{meContext.data!.me?.firstName}</a>
      </Menu.Button>
      <Transition as={Fragment} {...DropdownTransition}>
        <Menu.Items as="div" className="dropdown">
          <Link href={`/user/${meContext.data!.me!.username}`} passHref>
            <Menu.Item as="div" className="rounded-t-lg dropdown-item">
              {meContext.data!.me!.username}
            </Menu.Item>
          </Link>

          <Link href="/create/post" passHref>
            <Menu.Item as="div" className="dropdown-item">
              {t('create_post')}
            </Menu.Item>
          </Link>

          <Link href="/settings" passHref>
            <Menu.Item as="div" className="dropdown-item">
              {t('settings')}
            </Menu.Item>
          </Link>

          <Menu.Item
            as="div"
            className="rounded-b-lg dropdown-item"
            onClick={() => LogOut()}
          >
            {t('logout')}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default UserDropdown;
