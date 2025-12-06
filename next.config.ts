// import type { NextConfig } from 'next';
// import type { Configuration } from 'webpack';

// const nextConfig: NextConfig = {
//   output: 'standalone',
//   images: {
//     domains: ['localhost', 'qbotbackend.onrender.com'],
//   },
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   async headers() {
//     return [
//       {
//         source: '/api/auth/google-login',
//         headers: [
//           {
//             key: 'Cross-Origin-Opener-Policy',
//             value: 'unsafe-none',
//           },
//           {
//             key: 'Cross-Origin-Embedder-Policy',
//             value: 'unsafe-none',
//           },
//         ],
//       },
//     ];
//   },
//   webpack(config: Configuration): Configuration {
//     config.module?.rules?.push({
//       test: /\.svg$/,
//       use: ['@svgr/webpack'],
//     });
//     return config;
//   },
// };

// export default nextConfig;


import type { NextConfig } from 'next';
import type { Configuration } from 'webpack';

const nextConfig: NextConfig = {
  output: 'standalone',
  
  // FIXED: Updated from 'domains' to 'remotePatterns' to fix deprecation warning
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'qbotbackend.onrender.com',
      },
    ],
  },

  // REMOVED: The 'eslint' key is invalid in this version of Next.js and causes a crash.
  // To ignore linting during build, update your package.json build script to: "next build --no-lint"

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

  // PRESERVED: Your custom webpack config for SVGs
  webpack(config: Configuration): Configuration {
    config.module?.rules?.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

export default nextConfig;


