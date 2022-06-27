import Navbar from '@components/modules/Navbar';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

interface MainLayoutProps {
  children: React.ReactNode;
  background?: string;
}

const Layout: React.FC<MainLayoutProps> = ({ children, background }) => {
  const router = useRouter();

  return (
    <>
      <Toaster position="top-center" reverseOrder={true} />

      <Navbar />

      <main className="sm:pt-20">{children}</main>
    </>
  );
};

export default Layout;
