import type { NextConfig } from 'next';
import type { Configuration } from 'webpack';

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    domains: ['localhost', 'api.yourdomain.com'], // adjust your domains
  },
  webpack(config: Configuration): Configuration {
    config.module?.rules?.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
