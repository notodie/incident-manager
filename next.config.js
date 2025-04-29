/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  // Désactiver le stockage local en développement
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['bcryptjs'],
  },
};

module.exports = nextConfig; 