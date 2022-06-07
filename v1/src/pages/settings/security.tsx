import { Button } from '@components/elements';
import SettingsLayout from '@components/layouts/Settings';
import MeContext from '@src/contexts/MeContext';
import { RedirectAnonymous } from '@src/functions/ServerSideProps';
import React from 'react';
import { useTranslation } from 'react-i18next';

const SecuritySettingsPage = () => {
  const { t } = useTranslation();

  const { data: loginContext } = React.useContext(MeContext);

  return (
    <SettingsLayout
      current="security"
      heading="security"
      headingDescription=""
      head={{
        title: `${t('Security settings')} | hiStories`,
        description: `Security settings`,
        canonical: 'https://www.histories.cc/settings/security',
        openGraph: {
          title: `Security settings | hiStories`,
          type: 'website',
          url: 'https://www.histories.cc/settings/security',
          description: `Security settings`,
          site_name: 'Settings page',
        },
      }}
    >
      <h2 className="font-medium text-gray-600">Password</h2>

      {!loginContext?.me?.hasPassword ? (
        <>
          <span className="px-8">
            <div className="text-red-700 bg-red-100 border border-red-700 dark:border-[#373638] dark:bg-[#2b2b2b] lg:rounded-lg md:rounded-lg sm:rounded-lg shadow-sm dark:shadow-md">
              <div className="p-5 ">
                <div className="grid justify-items-center space-y-2">
                  You haven{"'"}t set a password yet.
                </div>
              </div>
            </div>
          </span>
          <p className="pb-4">
            Your account was created using Google, create new password to be
            able to login to your account with your email and password.
          </p>
          <Button style="primary_outline">Create password</Button>
        </>
      ) : (
        <div className="pt-6">
          <Button style="primary_outline">Change password</Button>
        </div>
      )}
    </SettingsLayout>
  );
};

export const getServerSideProps = RedirectAnonymous;

export default SecuritySettingsPage;
