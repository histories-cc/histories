import Layout from '@components/layouts/Main';
import { IndexPageMap } from '@components/molecules/maps';
import MeContext from '@src/contexts/MeContext';
import React, { useContext, } from 'react';
import { MapProvider } from 'react-map-gl';

const IndexPage: React.FC = () => {
  const { me } = useContext(MeContext);


  return (
    <MapProvider>
      <Layout>
        <IndexPageMap />
      </Layout>
    </MapProvider>
  );
}



export default IndexPage