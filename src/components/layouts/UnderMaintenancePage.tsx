import Image from 'next/image';
import Illustration from '../../../public/assets/maintenance.png';

const UnderMaintenance = () => {
  return (
    <div className="overflow-hidden">
      <main className="text-[#225345] flex flex-col gap-8 absolute left-16 top-1/2 w-1/2 -translate-y-1/2">
        <h1 className="text-[64px] font-bold leading-[64px] tracking-tight">
          Histories are under maintenance!
        </h1>
        <p className="text-2xl leading-9">
          We are currently working on stable and functional update for the best
          user experience.
        </p>
        <strong className="text-2xl font-semibold leading-9">
          Thank you for your patience!
        </strong>
      </main>

      <div className="absolute right-0 top-1/2 -translate-y-1/2">
        <Splash />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4">
          <Image
            src={Illustration}
            alt=""
            layout="responsive"
            objectFit="scale-down"
          />
        </div>
      </div>
    </div>
  );
};

const Splash: React.FC = () => {
  return (
    <svg
      width="973"
      height="1007"
      viewBox="0 0 973 1007"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.16"
        d="M892.262 632.01C869.208 689.609 855.644 748.586 828.639 804.439C794.897 874.224 786.608 978.693 712.983 1002.8C636.752 1027.76 570.128 934.136 492.344 914.554C431.371 899.203 366.697 919.05 306.62 900.495C239.919 879.894 176.084 848.994 125.207 801.163C69.6476 748.93 -7.12591 688.635 0.531162 612.732C8.96977 529.083 139.458 504.902 163.229 424.263C186.652 344.8 96.0476 257.994 127.669 181.428C157.095 110.181 245.774 83.7496 316.489 53.1729C387.686 22.3884 464.167 -9.88088 540.674 2.84961C616.121 15.4037 669.013 80.7755 733.132 122.501C792.981 161.447 865.172 184.491 907.831 241.776C950.704 299.349 975.64 372.565 972.778 444.31C970.029 513.208 917.881 568.001 892.262 632.01Z"
        fill="#2D6C5A"
      />
    </svg>
  );
};

export default UnderMaintenance;
