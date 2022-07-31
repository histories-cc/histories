import Navbar from '@components/molecules/Navbar';
import SettingsNavigation from '@components/molecules/SettingsNavigation';
import MeContext from '@src/contexts/MeContext';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
  background?: string;
}

const Settings: React.FC<MainLayoutProps> = ({ children, background }) => {
  // contexts
  const { loading, isLoggedIn } = useContext(MeContext);

  // hooks
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isLoggedIn) router.push('/');
  }, [loading]);

  return (
    <>
      <Navbar />

      <main className="sm:pt-20">
        <SettingsNavigation />
        {children}
      </main>
    </>
  );
};

export default Settings;
