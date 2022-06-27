import Navbar from '@components/modules/Navbar';
import React, { useContext, useEffect } from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
  background?: string;
}

const Layout: React.FC<MainLayoutProps> = ({ children, background }) => {
  return (
    <>
      <Navbar />

      <main className="sm:pt-20">{children}</main>
    </>
  );
};

export default Layout;
