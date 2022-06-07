import { OpenGraph } from 'next-seo/lib/types';

type HeadProps = {
  title: string;
  description: string;
  canonical?: string;
  openGraph: OpenGraph;
};

export default HeadProps;
