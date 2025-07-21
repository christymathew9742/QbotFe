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
    domains: ['localhost', 'https://qbotbackend.onrender.com/'], // adjust your domains
  },
  // ✅ Skip ESLint during builds (optional; useful for Vercel or CI)
  eslint: {
    ignoreDuringBuilds: true,
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

/**
 * 🔧 To disable "@typescript-eslint/no-explicit-any",
 * create/edit your `.eslintrc.js` file:
 *
 * module.exports = {
 *   rules: {
 *     '@typescript-eslint/no-explicit-any': 'off',
 *   },
 * };
 */

