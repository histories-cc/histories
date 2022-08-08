module.exports = {
  reactStrictMode: true,

  async redirects() {
    return [
      {
        source: "/storybook",
        destination: "/storybook/index.html",
        permanent: true,
      },
    ];
  },

  images: {
    minimumCacheTTL: 60,
    domains: ['i.pravatar.cc', 'external-content.duckduckgo.com'],
  },


};
