import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    const workerUrl = process.env.WORKER_URL ?? 'http://localhost:8787';
    return [
      { source: '/api/:path*', destination: `${workerUrl}/:path*` },
    ];
  },
};

export default nextConfig;
