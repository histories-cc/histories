import React from 'react';
import LogoImage from '../../../public/logo/big.svg';
import Image from 'next/image';
import Link from 'next/link';

interface INavbarButtonProps {
  children: React.ReactNode;
  href: string;
}

const NavbarButton: React.FC<INavbarButtonProps> = ({ href, children }) => {
  return (
    <Link href={href} passHref>
      <button className="py-[18px] w-32 text-sm text-dark font-bold uppercase rounded-md hover:bg-zinc-100 transition-all ease-in-out duration-500">
        {children}
      </button>
    </Link>
  );
};

const Navbar: React.FC = () => {
  const isLoggedIn = true;

  return (
    <nav className="w-full fixed bg-[#FAFCFE] drop-shadow-sm flex items-center justify-between py-[10px] pr-11">
      <div className="flex">
        <Link href="/" passHref>
          <div className="px-11 flex items-center cursor-pointer">
            <Image
              width="136.72px"
              height="32.38px"
              src={LogoImage}
              alt="logo"
            />
          </div>
        </Link>

        <div className="flex gap-2">
          <NavbarButton href="/feed">Procházet</NavbarButton>
          <NavbarButton href="/">mapa</NavbarButton>
        </div>
      </div>

      {isLoggedIn ? (
        <div className="flex gap-2">
          <Link href="/create/post">
            <button className="py-[18px] px-4 text-sm text-white bg-brand font-bold uppercase rounded-md transition-all ease-in-out duration-500 ">
              vytvořit příspěvek
            </button>
          </Link>
        </div>
      ) : (
        <NavbarButton href="/login">přihlásit se</NavbarButton>
      )}
    </nav>
  );
};

export default Navbar;
