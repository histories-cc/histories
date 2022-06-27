import React from 'react';
import SettingsLayout from '@components/layouts/Settings';
import { AccountSettingsTemplate } from '@components/templates/settings';
import Head from 'next/head';

const AccountSettingsPage: React.FC = () => {
  return (
    <SettingsLayout>
      <Head>
        <title>Account settings</title>
        <meta name="description" content="Account settings" />
        <link rel="icon" href="/icons/favicon.ico" />
      </Head>

      <AccountSettingsTemplate />
    </SettingsLayout>
  );
};

export default AccountSettingsPage;
