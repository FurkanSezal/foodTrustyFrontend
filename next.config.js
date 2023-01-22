/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  /* webpack5: true, */
  images: {
    unoptimized: true,
  },
  /* webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  }, */
  env: {
    UPTADE_FRONT_END: process.env.UPTADE_FRONT_END,
    PINATA_API_KEY: process.env.PINATA_API_Key,
    PINATA_API_SECRET: process.env.PINATA_API_Secret,
    PINATA_JWT: process.env.PINATA_JWT,
  },
};

module.exports = nextConfig;
