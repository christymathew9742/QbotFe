/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // add this line
  webpack(config:any) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

module.exports = nextConfig;

