import type { NextConfig } from 'next';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'dstqm.nedubd.com' , 
      'i.pinimg.com',
      'placehold.co',
      'images.pexels.com',
      'localhost',
      'task.bamsbd.com',
      'shinystepsedu.com',
      'api.shinystepsedu.com',
      'test.bamsbd.com',
      'dstqm.nedubd.com',
       'alaminabn.com',
       '62.72.30.40',
       '62.72.30.40:3008',
       '62.72.30.40:3007',
       'bbimadrasah.org',
      'backend-beanibazar-ideal-madrasah.vercel.app'], 

    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};



export default nextConfig;
