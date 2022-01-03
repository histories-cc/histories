import SettingsLayout from '@components/Layouts/Settings';
import { RedirectAnonymous } from '@lib/functions/ServerSideProps';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Account = () => {
  const { t } = useTranslation();

  return (
    <SettingsLayout
      current="account"
      heading="account"
      headingDescription=""
      head={{
        title: `${t('Account settings')} | hiStories`,
        description: `Account settings`,
        canonical: 'https://www.histories.cc/settings',
        openGraph: {
          title: `Account settings | hiStories`,
          type: 'website',
          url: 'https://www.histories.cc/settings',
          description: `Account settings`,
          site_name: 'Settings page',
        },
      }}
    >
      <h3 className="text-2xl font-medium">{t('delete account')}</h3>
      <p className="pb-4 text-base text-gray-500">
        This action cannot be taken back.
      </p>
      <button className="block px-4 py-1 font-medium text-red-600 bg-red-200 border border-red-200 rounded-md">
        {t('delete account')}
      </button>
    </SettingsLayout>
  );
};

export const getServerSideProps = RedirectAnonymous;

export default Account;
