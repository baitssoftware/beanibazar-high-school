import type { NextConfig } from 'next';



const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['dstqm.nedubd.com'], 

    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};



export default nextConfig;
