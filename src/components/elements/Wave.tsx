import React from 'react';
import { orange_main } from '../../../shared/constants/colors';

const Wave: React.FC = () => {
  return (
    <svg
      width="100%"
      height="auto"
      viewBox="0 0 1440 521"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 112V180V252V520.5L60 514.5L360 484.5C480 472.5 600 460.5 720 442.5C760 436.5 800 429.833 840 423.167C920 409.833 1000 396.5 1080 388.5C1200 376.5 1320 376.5 1380 376.5H1440V252V0L1392 6C1344 12 1248 24 1152 24C1104 24 1056 21 1008 18C960 15 912 12 864 12C768 12 672 24 576 60C418.583 119.031 167.71 132.964 0 112Z"
        fill="url(#paint0_linear_2658_10409)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_2658_10409"
          x1="-6.10947e-06"
          y1="520.5"
          x2="1462.56"
          y2="418.956"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#EB4A00" />
          <stop offset="1" stopColor={orange_main} />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Wave;
