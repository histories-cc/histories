import Main from '@components/layouts/Main';
import AboutTemplate from '@components/templates/AboutTemplate';
import { NextPage } from 'next';
import React from 'react';

const AboutPage: NextPage = () => {
  return (
    <Main>
      <AboutTemplate />
    </Main>
  );
};

export default AboutPage;
