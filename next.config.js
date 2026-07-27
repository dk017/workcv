/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    serverComponentsExternalPackages: ["playwright-core"],
    outputFileTracingIncludes: {
      "/api/cv/import": [
        "./node_modules/pdfjs-dist/legacy/build/**/*",
        "./node_modules/@napi-rs/canvas*/**/*",
      ],
    },
  },
  webpack(config, { isServer }) {
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
      };
    }
    return config;
  },
  async headers() {
    return [
      {
        source: "/embed/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors https: http:",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/cv-template-uk", destination: "/templates", permanent: true },
      {
        source: "/cv-builder-uk",
        destination: "/cv-builder-no-subscription-uk",
        permanent: true,
      },
      {
        source: "/myperfectcv-alternative",
        destination: "/myperfectcv-alternative-uk",
        permanent: true,
      },
      {
        source: "/cv-with-no-experience",
        destination: "/cv-no-experience-uk",
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
      {
        source: "/tools/salary-calculator",
        destination: "/tools/take-home-pay-calculator-uk",
        permanent: true,
      },
      {
        source: "/tools/free-cover-letter-maker-uk",
        destination: "/tools/cover-letter-generator-uk",
        permanent: true,
      },
      {
        source: "/tools/personal-statement-generator",
        destination: "/tools/cv-summary-generator-uk",
        permanent: true,
      },
      {
        source: "/tools/cv-length-checker",
        destination: "/tools/cv-word-count-checker",
        permanent: true,
      },
      {
        source: "/tools/ats-cv-checker-uk",
        destination: "/tools/ats-score-checker",
        permanent: true,
      },
      {
        source: "/tools/uk-living-wage-checker-2026",
        destination: "/tools/uk-living-wage-checker",
        permanent: true,
      },
      {
        source: "/tools/cv-builder-no-subscription",
        destination: "/cv-builder-no-subscription-uk",
        permanent: true,
      },
      {
        source: "/tools/resume-builder-no-subscription-uk",
        destination: "/resume-builder-uk-no-subscription",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
