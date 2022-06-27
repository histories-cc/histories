import Main from '@components/layouts/Main';
import AboutTemplate from '@components/templates/AboutTemplate';
import React from 'react';
import { useTranslation } from 'react-i18next';

const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Main>
      <AboutTemplate />
    </Main>
  );
};

export default AboutPage;
