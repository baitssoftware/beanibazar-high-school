'use client';

import { useGetList } from '@/hooks/APIHooks';
import { BellDot } from 'lucide-react';
import Link from 'next/link';
import Marquee from 'react-fast-marquee';

interface Notice {
  title: string;
  id: string; // Assuming each notice has a unique `id`
}

const NoticeSection = () => {
  const { data: noticeData } = useGetList<Notice>('/notice', 'notices');

  return (
    <div className="mx-auto bg-white text-bengali py-3">
      <div className=" shadow-xl shadow-primary_school/10 border border-primary_school flex items-center overflow-hidden">
        <div
          className="bg-primary_school text-white py-3 px-6 border border-primary_school"
          style={{
            backgroundImage: `url("")`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        >
          <p className="font-semibold">Notices</p>
        </div>
        <div>
          <Marquee pauseOnHover>
            {noticeData?.map((notice, idx) => (
              <div key={idx} style={{ marginRight: '20px' }}>
                <Link
                  className="flex items-center gap-2 text-"
                  href={`/notice`} // Redirecting to notice details page
                >
                  <div className="h-full p-3 bg-red-400 text-white">
                    <BellDot className="w-4 h-4" />
                  </div>{' '}
                  {notice?.title}
                </Link>
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </div>
  );
};

export default NoticeSection;
