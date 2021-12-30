import SettingsLayout from '@components/Screens/Settings/SettingsLayout';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Account = () => {
  const { t } = useTranslation();

  return (
    <SettingsLayout
      current="security"
      title="security"
      heading="security"
      headingDescription=""
    >
      <h3 className="text-2xl font-medium">{t('password')}</h3>
      <div className="py-4">
        <input
          value="this is not your password"
          className="w-full max-w-sm px-2 text-gray-400 border border-gray-300 outline-none dark:bg-[#45413C] rounded-md focus:border-gray-500 py-1.5"
          type="password"
          disabled
        />
      </div>
      <button className="block px-4 py-1 font-medium text-gray-600 bg-gray-200 border border-gray-200 rounded-md hover:bg-gray-300">
        {t('change password')}
      </button>
    </SettingsLayout>
  );
};

export default Account;