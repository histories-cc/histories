import Layout from '@components/layouts/Main';
import { IndexPageMap } from '@components/molecules/maps';
import MeContext from '@src/contexts/MeContext';
import { NextPage } from 'next';
import React, { useContext } from 'react';
import { MapProvider } from 'react-map-gl';

const IndexPage: NextPage = () => {
  const { me } = useContext(MeContext);

  return (
    <MapProvider>
      <Layout>
        <IndexPageMap />
      </Layout>
    </MapProvider>
  );
};

export default IndexPage;
