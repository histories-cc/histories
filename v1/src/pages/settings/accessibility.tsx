import SettingsLayout from '@components/layouts/Settings';
import { RedirectAnonymous } from '@src/functions/ServerSideProps';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Account = () => {
  const { t } = useTranslation();

  return (
    <SettingsLayout
      current="accessibility"
      heading="accessibility"
      headingDescription=""
      head={{
        title: `${t('Accessibility settings')} | hiStories`,
        description: `Accessibility settings`,
        canonical: 'https://www.histories.cc/settings/accessibility',
        openGraph: {
          title: `Accessibility settings | hiStories`,
          type: 'website',
          url: 'https://www.histories.cc/settings/accessibility',
          description: `Accessibility settings`,
          site_name: 'Settings page',
        },
      }}
    >
      <h3 className="text-2xl font-medium">{t('language')}</h3>
      <div className="flex py-4 gap-6"></div>
    </SettingsLayout>
  );
};

export const getServerSideProps = RedirectAnonymous;

export default Account;
