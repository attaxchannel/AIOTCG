const withPWA = require('next-pwa').default({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    { urlPattern: /^https.*\/api\/jobs/, handler: 'NetworkFirst', options: { cacheName: 'api-jobs' } },
    { urlPattern: /\.(mp4|mov|webm)$/, handler: 'NetworkOnly' }
  ]
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone'
};

module.exports = withPWA(nextConfig);
