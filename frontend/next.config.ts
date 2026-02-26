import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  basePath: '/bible',
  output: 'standalone',
  images: {
    unoptimized: false,
    formats: ['image/webp'],
  },
};

export default nextConfig;
