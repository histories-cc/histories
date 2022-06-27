import Splash from '@components/elements/svgs/Splash';
import Head from 'next/head';

import Image from 'next/image';

const UnderMaintenance: React.FC = () => {
  return (
    <>
      <Head>
        <title>Histories are under maintenance!</title>
        <meta
          name="description"
          content="We are currently working on stable and functional update for the
            best user experience."
        />
        <link rel="icon" href="/icons/favicon.ico" />
      </Head>

      <div className="overflow-hidden">
        <main className="text-[#225345] flex flex-col gap-8 absolute left-16 top-1/2 w-1/2 -translate-y-1/2">
          <h1 className="text-[64px] font-bold leading-[64px] tracking-tight">
            Histories are under maintenance!
          </h1>
          <p className="text-2xl leading-9">
            We are currently working on stable and functional update for the
            best user experience.
          </p>
          <strong className="text-2xl font-semibold leading-9">
            Thank you for your patience!
          </strong>
        </main>

        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <Splash />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4">
            <Image
              src="/assets/maintenance.png"
              alt=""
              width="100%"
              height="100%"
              layout="responsive"
              objectFit="scale-down"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default UnderMaintenance;
