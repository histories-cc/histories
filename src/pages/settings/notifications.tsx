import { CheckboxElement } from '@components/elements';
import SettingsLayout from '@components/layouts/Settings';
import { useUpdateProfileMutation } from '@graphql';
import MeContext from '@src/contexts/MeContext';
import { RedirectAnonymous } from '@src/functions/ServerSideProps';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Account = () => {
  const { t } = useTranslation();

  const { data } = React.useContext(MeContext);

  const [updateProfileMutation] = useUpdateProfileMutation();

  const notificationSettings = data?.me?.notificationSettings;

  return (
    <SettingsLayout
      current="notifications"
      heading="notifications"
      headingDescription=""
      head={{
        title: `${t('Notifications settings')} | hiStories`,
        description: `Notifications settings`,
        canonical: 'https://www.histories.cc/settings/notifications',
        openGraph: {
          title: `Notifications settings | hiStories`,
          type: 'website',
          url: 'https://www.histories.cc/settings/notifications',
          description: `Notifications settings`,
          site_name: 'Settings page',
        },
      }}
    >
      <h3 className="text-2xl font-medium">{t('email_notifications')}</h3>
      <p className="pb-4 text-base text-gray-500">
        {t('email_notifications_description')}
      </p>
      <CheckboxElement
        title={t('email_notifications_new_followers')}
        description={t('email_notifications_new_followers_description')}
        args={{
          defaultChecked: notificationSettings?.newFollower,
          onClick: async (e) =>
            await updateProfileMutation({
              variables: {
                input: {
                  notificationSettings: {
                    newFollower: e.currentTarget.checked,
                  },
                },
              },
            }),
        }}
      />
      <CheckboxElement
        title={t('email_notifications_new_posts')}
        description={t('email_notifications_new_posts_description')}
        args={{
          defaultChecked: notificationSettings?.followingUserPost,
          onClick: async (e) =>
            await updateProfileMutation({
              variables: {
                input: {
                  notificationSettings: {
                    followingUserPost: e.currentTarget.checked,
                  },
                },
              },
            }),
        }}
      />
      <CheckboxElement
        title={t('email_notifications_places')}
        description={t('email_notifications_places_description')}
        args={{
          defaultChecked: notificationSettings?.followingPlacePost,
          onClick: async (e) =>
            await updateProfileMutation({
              variables: {
                input: {
                  notificationSettings: {
                    followingPlacePost: e.currentTarget.checked,
                  },
                },
              },
            }),
        }}
      />
      <CheckboxElement
        title={t('email_notifications_histories_newsletter')}
        description={t('email_notifications_histories_newsletter_description')}
        args={{
          defaultChecked: notificationSettings?.newsletter,
          onClick: async (e) =>
            await updateProfileMutation({
              variables: {
                input: {
                  notificationSettings: {
                    newsletter: e.currentTarget.checked,
                  },
                },
              },
            }),
        }}
      />
    </SettingsLayout>
  );
};

export const getServerSideProps = RedirectAnonymous;

export default Account;
