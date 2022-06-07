import SettingsLayout from '@components/layouts/Settings';
import { RedirectAnonymous } from '@src/functions/ServerSideProps';
import { useTheme } from 'next-themes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { HiMoon, HiOutlineDesktopComputer, HiSun } from 'react-icons/hi';

const Account: React.FC = () => {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();

  return (
    <SettingsLayout
      current="appearance"
      heading="appearance"
      headingDescription=""
      head={{
        title: `${t('Appearance settings')} | hiStories`,
        description: `Accessibility settings`,
        canonical: 'https://www.histories.cc/settings/appearance',
        openGraph: {
          title: `Appearance settings | hiStories`,
          type: 'website',
          url: 'https://www.histories.cc/settings/appearance',
          description: `Appearance settings`,
          site_name: 'Settings page',
        },
      }}
    >
      <h3 className="text-2xl font-medium">{t('theme')}</h3>
      <div className="flex flex-col py-4 md:flex-row gap-6">
        <ThemeCard
          title={t('light')}
          onClick={() => setTheme('light')}
          active={theme === 'light'}
        >
          <div className="flex items-center">
            <p className="w-full pl-1 text-base font-semibold truncate">
              Light
            </p>
          </div>
          <div className="flex items-center justify-center flex-grow">
            <HiSun className="w-14 h-14" />
          </div>
        </ThemeCard>
        <ThemeCard
          title={t('dark')}
          onClick={() => setTheme('dark')}
          active={theme === 'dark'}
        >
          <div className="flex items-center">
            <p className="w-full pl-1 text-base font-semibold truncate">Dark</p>
          </div>
          <div className="flex items-center justify-center flex-grow">
            <HiMoon className="w-16 h-14" />
          </div>
        </ThemeCard>
        <ThemeCard
          title={t('system')}
          onClick={() => setTheme('system')}
          active={theme === 'system'}
        >
          <div className="flex items-center">
            <p className="w-full pl-1 text-base font-semibold truncate">
              System
            </p>
          </div>
          <div className="flex items-center justify-center flex-grow">
            <HiOutlineDesktopComputer className="w-14 h-14" />
          </div>
        </ThemeCard>
      </div>
    </SettingsLayout>
  );
};

const ThemeCard: React.FC<{
  onClick: () => void;
  title: string;
  active: boolean;
}> = ({ children, onClick, active }) => {
  return (
    <div
      className={`rounded-xl px-3 py-3 flex flex-col cursor-pointer group border-2 transition ease-in-out border-gray-300 w-36 h-32
      ${
        active
          ? 'text-brand border-brand'
          : 'hover:border-gray-400 dark:hover:border-gray-400 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-400 text-gray-500 dark:text-gray-400'
      }`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

/* 
<div
      onClick={onClick}
      className={`flex flex-col w-36 h-36 p-2 rounded-xl border-2 cursor-pointer transition-all ease-in-out duration-300 ${
        active
          ? 'text-green-500 border-green-500'
          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-400 text-gray-500 dark:text-gray-400'
      }`}
    >
      <a className="font-semibold">{title}</a>
      <div className="flex items-center justify-center w-full h-full">
        {children}
      </div>
    </div>
    */

export const getServerSideProps = RedirectAnonymous;

export default Account;
