import Navbar from '@components/modules/Navbar';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

interface MainLayoutProps {
  redirectLogged?: boolean;
  redirectNotLogged?: boolean;
  children: React.ReactNode;
  background?: string;
}

const Layout: React.FC<MainLayoutProps> = ({
  redirectLogged,
  redirectNotLogged,
  children,
  background,
}) => {
  const router = useRouter();

  return (
    <>
      <Toaster position="top-center" reverseOrder={true} />

      <Navbar />

      <div
        className={
          'min-h-screen pt-14 ' + background || 'bg-[#FAFBFB] dark:bg-[#171716]'
        }
      >
        {children}
      </div>
    </>
  );
};

export default Layout;
