import React, { useContext } from 'react';
import LogoImage from '../../../public/logo/big.svg';
import Image from 'next/image';
import Link from 'next/link';
import { HiOutlineHome, HiOutlineLocationMarker } from 'react-icons/hi';
import { FiCompass, FiPlusSquare } from 'react-icons/fi';
import { CgProfile } from 'react-icons/cg';
import MeContext from '@src/contexts/MeContext';
import { Menu, Transition } from '@headlessui/react';
import Cookie from 'js-cookie';
import { useRouter } from 'next/router';
import { useDeleteSessionMutation } from '@graphql';

interface INavbarButtonProps {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  href: string;
}

interface IMenuItem {
  active: boolean;
}

const NavbarButton: React.FC<INavbarButtonProps> = ({
  href,
  children,
  icon,
}) => {
  return (
    <Link href={href} passHref>
      <button
        className={`sm:py-[18px] ${
          children ? 'sm:w-32' : ''
        } text-sm text-dark font-bold uppercase rounded-md sm:hover:bg-zinc-100 transition-all ease-in-out duration-500`}
      >
        <div className="hidden sm:block">{children}</div>
        <div className="block sm:hidden">{icon}</div>
      </button>
    </Link>
  );
};

const Navbar: React.FC = () => {
  // contexts
  const { me } = useContext(MeContext);

  // hooks
  const router = useRouter();
  const [deleteSession] = useDeleteSessionMutation();

  async function Logout() {
    const session = Cookie.get('session');

    if (typeof session !== 'string') return;

    try {
      await deleteSession({
        variables: {
          session,
        },
      });
    } catch (err) {}

    Cookie.remove('session');
    router.reload();
  }

  return (
    <nav className="w-full fixed top-full -translate-y-full sm:translate-y-0 sm:top-0  bg-[#FAFCFE] sm:drop-shadow-sm flex items-center justify-between sm:py-[10px] sm:pr-11">
      <div className="flex sm:w-auto">
        <Link href="/" passHref>
          <div className="hidden sm:flex px-11 items-center cursor-pointer">
            <Image
              width="136.72px"
              height="32.38px"
              src={LogoImage}
              alt="logo"
            />
          </div>
        </Link>

        <div className="w-full flex sm:gap-2 justify-around pb-7 pt-4 sm:p-0 bg-white drop-shadow-lg sm:drop-shadow-none">
          <NavbarButton href="/feed" icon={<HiOutlineHome size={36} />}>
            Procházet
          </NavbarButton>
          <NavbarButton href="/" icon={<FiCompass size={36} />}>
            mapa
          </NavbarButton>

          <NavbarButton href="/" icon={<HiOutlineLocationMarker size={36} />} />
          <NavbarButton href="/create/post" icon={<FiPlusSquare size={36} />} />

          <NavbarButton href="/" icon={<CgProfile size={36} />}></NavbarButton>
        </div>
      </div>

      {me ? (
        <div className="hidden sm:flex gap-2">
          <Link href="/create/post">
            <button className="py-[18px] px-4 text-sm text-white bg-brand font-bold uppercase rounded-md transition-all ease-in-out duration-500 ">
              vytvořit příspěvek
            </button>
          </Link>
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button>
              <button className="sm:py-[18px] sm:w-32 text-sm text-dark font-bold uppercase rounded-md sm:hover:bg-zinc-100 transition-all ease-in-out duration-500">
                {me.firstName}
              </button>
            </Menu.Button>

            <Transition
              as={React.Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-1 py-1 ">
                  <Menu.Item>
                    {({ active }: IMenuItem) => (
                      <div>
                        <Link href={`/u/${me.username}`}>
                          <a
                            className={`${
                              active
                                ? 'bg-violet-500 text-white'
                                : 'text-gray-900'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            Profile
                          </a>
                        </Link>
                      </div>
                    )}
                  </Menu.Item>

                  <Menu.Item>
                    {({ active }: IMenuItem) => (
                      <button
                        onClick={Logout}
                        className={`${
                          active ? 'bg-violet-500 text-white' : 'text-gray-900'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      ) : (
        <NavbarButton href="/login">přihlásit se</NavbarButton>
      )}
    </nav>
  );
};

export default Navbar;
