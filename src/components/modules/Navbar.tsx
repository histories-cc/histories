import React, { useContext } from 'react';
import LogoImage from '../../../public/logo/big.svg';
import Image from 'next/image';
import Link from 'next/link';
import { HiOutlineHome, HiOutlineLocationMarker } from 'react-icons/hi';
import { FiCompass, FiPlusSquare } from 'react-icons/fi';
import { CgProfile } from 'react-icons/cg';
import MeContext from '@src/contexts/MeContext';

interface INavbarButtonProps {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  href: string;
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
  const { me } = useContext(MeContext);

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

          <NavbarButton href={`/u/${me.username}`}>{me.firstName}</NavbarButton>
        </div>
      ) : (
        <NavbarButton href="/login">přihlásit se</NavbarButton>
      )}
    </nav>
  );
};

export default Navbar;
