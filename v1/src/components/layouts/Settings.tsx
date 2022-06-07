import { Separator } from '@components/elements';
import { Layout } from '@components/layouts';
import HeadProps from '@src/types/head';
import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';

export type SettingsLayoutProps = {
  head: HeadProps;
  current: string;
  heading: string;
  headingDescription?: string;
};

const SettingsLayout: React.FC<SettingsLayoutProps> = ({
  head,
  current,
  children,
  heading,
  headingDescription,
}) => {
  const { t } = useTranslation();

  return (
    <Layout head={head}>
      <div className="w-full">
        <div className="w-full max-w-4xl px-6 m-auto xl:px-0">
          <div className="flex pt-6 pb-8">
            <div className="py-2">
              {/* PAGE HEADING */}
              <h1 className="pb-1 text-5xl font-bold tracking-tight">
                {t(heading)}
              </h1>

              {/* PAGE DESCRIPTION */}
              <h2 className="tracking-wide text-gray-500">
                {t(headingDescription ?? '')}
              </h2>
            </div>
          </div>
          <Separator />
          {/* MAIN GRID */}
          <div className="flex w-full pt-12">
            {/* LEFT SIDEBAR */}
            <ul className="flex flex-col w-48 pt-4 tracking-wide text-gray-500 text lg:pt-0 space-y-2">
              <SubNavItem title="account" href="/settings" current={current} />
              <SubNavItem
                title="security"
                href="/settings/security"
                current={current}
              />
              <SubNavItem
                title="notifications"
                href="/settings/notifications"
                current={current}
              />
              <SubNavItem
                title="appearance"
                href="/settings/appearance"
                current={current}
              />
              <SubNavItem
                title="accessibility"
                href="/settings/accessibility"
                current={current}
              />
            </ul>

            {/* ACTUAL SETTINGS */}
            <div className="w-full h-full px-8">{children}</div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

type SubNavItemProps = {
  title: string;
  href: string;
  current: string;
};

const SubNavItem: React.FC<SubNavItemProps> = ({ title, href, current }) => {
  const { t } = useTranslation();

  return (
    <li>
      <Link href={href}>
        <a
          className={`flex py-2 px-4 rounded-md w-full font-medium ${
            current === title
              ? 'bg-[#45413C] text-white'
              : 'hover:bg-gray-100 dark:hover:bg-[#45413C] text-gray-600 dark:text-gray-400'
          }`}
        >
          {t(title)}
        </a>
      </Link>
    </li>
  );
};

export default SettingsLayout;
