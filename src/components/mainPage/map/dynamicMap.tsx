import dynamic from 'next/dynamic';

export default dynamic(() => import('./map'), {
  ssr: false,
});