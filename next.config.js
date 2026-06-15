/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  webpack(config, { isServer }) {
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
      };
    }
    return config;
  },
  async redirects() {
    return [
      { source: "/cv-template-uk", destination: "/templates", permanent: true },
      { source: "/cv-builder-uk", destination: "/cv-builder", permanent: true },
      {
        source: "/cv-with-no-experience-uk",
        destination: "/cv-with-no-experience",
        permanent: true,
      },
      {
        source: "/student-cv-template-uk",
        destination: "/student-cv-template",
        permanent: true,
      },
      {
        source: "/livecareer-alternative-uk",
        destination: "/livecareer-alternative",
        permanent: true,
      },
      {
        source: "/cvmaker-uk-alternative",
        destination: "/cvmaker-alternative",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
