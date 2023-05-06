/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  webpack(config) {
    const svgrWebpackRules = {
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack']
    };
    if (config.module) {
      if (config.module.rules) {
        config.module.rules.push(svgrWebpackRules);
      } else {
        config.module.rules = [svgrWebpackRules];
      }
    } else {
      config.module = {
        rules: []
      };
    }

    return config;
  }
};
