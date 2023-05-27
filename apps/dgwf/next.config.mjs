/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */

import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin';

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['workspace/db'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }

    return config;
  }
};

export default nextConfig;
