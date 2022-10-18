const withPWA = require('next-pwa');
const nextTranslate = require('next-translate');

module.exports = nextTranslate({
  reactStrictMode: true,

  async redirects() {
    return [
      {
        source: '/storybook',
        destination: '/storybook/index.html',
        permanent: true,
      },
    ];
  },

  images: {
    minimumCacheTTL: 345600,
    domains: ['i.pravatar.cc', 'avatars.dicebear.com', 'histories.cc'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [
      16, 32, 48, 64, 96, 128, 256, 384, 512, 1080, 1200, 1920, 2048, 3840,
    ],
  },
});
