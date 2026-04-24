/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    browsersListForSwc: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
};

export default nextConfig;
