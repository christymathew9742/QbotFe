// import type { NextConfig } from 'next';
// import type { Configuration } from 'webpack';

// const nextConfig: NextConfig = {
//   output: "standalone",
//   images: {
//     domains: ['localhost', 'api.yourdomain.com'], // adjust your domains
//   },
//   webpack(config: Configuration): Configuration {
//     config.module?.rules?.push({
//       test: /\.svg$/,
//       use: ["@svgr/webpack"],
//     });
//     return config;
//   },
// };

// export default nextConfig;

import type { NextConfig } from 'next';
import type { Configuration } from 'webpack';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost', 'qbotbackend.onrender.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        source: '/api/auth/google-login',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'unsafe-none',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
        ],
      },
    ];
  },
  webpack(config: Configuration): Configuration {
    config.module?.rules?.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

export default nextConfig;


