/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals.filter(
        (external) => typeof external !== 'function' || external.toString().indexOf('sharp') === -1
      );
    }
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  }
};

export default nextConfig;
