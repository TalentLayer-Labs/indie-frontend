/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'ipfs.infura.io',
      'media0.giphy.com',
      'ipfs.io',
      'statics-polygon-lens-staging.s3.eu-west-1.amazonaws.com',
      'lens.infura-ipfs.io',
      'source.unsplash.com',
      'arweave.net',
      'images.lens.phaver.com',
      'cdn.stamp.fyi',
      'ik.imagekit.io',
      '',
    ],
  },
};

module.exports = {
  webpack: config => {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [{ loader: '@svgr/webpack', options: { icon: true } }],
    });
    return config;
  },
  ...nextConfig,
};
