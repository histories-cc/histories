import Layout from '@components/layouts/Main';
import MeContext from '@src/contexts/MeContext';
import Head from 'next/head';
import Image from 'next/image';
import { useContext } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  const { me } = useContext(MeContext);

  return (
    <Layout>
      <div>{JSON.stringify(me)}</div>
    </Layout>
  );
}
