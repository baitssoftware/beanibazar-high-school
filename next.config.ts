import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

// const nextConfig: NextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'i.pinimg.com',
//       },
//       {
//         protocol: 'https',
//         hostname: 'placehold.co',
//       },
//       {
//         protocol: 'https',
//         hostname: 'images.pexels.com',
//       },
//       {
//         protocol: 'http',
//         hostname: 'localhost',
//       },
//       {
//         protocol: 'https',
//         hostname: 'task.bamsbd.com',
//       },
//       {
//         protocol: 'https',
//         hostname: 'shinystepsedu.com',
//       },
//       {
//         protocol: 'https',
//         hostname: 'api.shinystepsedu.com',
//       },
//       {
//         protocol: 'https',
//         hostname: 'test.bamsbd.com',
//       },
//       {
//         protocol: 'https',
//         hostname: 'dstqm.nedubd.com',
//       },
//       {
//         protocol: 'https',
//         hostname: 'backend-beanibazar-ideal-madrasah.vercel.app',
//       },
//       {
//         protocol: 'https',
//         hostname: 'bb',
//       },
//     ],
//   },
// };

export default nextConfig;
