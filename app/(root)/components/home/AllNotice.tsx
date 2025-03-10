'use client';

import { useGetList } from '@/hooks/APIHooks';
import { ChevronRight, Eye } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Notice {
  title: string;
  createdAt: string;
  id: string;
}

export default function AllNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const { data: noticeData, isLoading } = useGetList<Notice>('/notice', 'notices');
  const router = useRouter();

  useEffect(() => {
    if (noticeData) {
      setNotices(noticeData);
    }
  }, [noticeData]);

  const handleViewNotice = (noticeId: string) => {
    router.push(`/notice/${noticeId}`);
  };

  if (isLoading)
    return (
      <div className="text-center py-8 h-[600px] flex items-center justify-center">Loading...</div>
    );

  return (
    <div className=" overflow-hidden shadow-lg h-full flex flex-col">
      {/* Header */}
      <h2 className="heading">All Published Notices</h2>

      {/* Notice Table */}
      <div className="bg-[#f5f9f5] flex-grow overflow-y-auto">
        <table className="w-full">
          <tbody>
            {notices.map((notice, index) => {
              // Extract date from createdAt
              const date = new Date(notice.createdAt);
              const formattedDate = `${date.toLocaleString('en-US', { month: 'long' })} ${date.getDate()}, ${date.getFullYear()}`;

              return (
                <tr
                  key={notice.id}
                  className={`border-b ${index % 2 === 0 ? 'bg-[#f5f9f5]' : 'bg-[#edf5ed]'}`}
                >
                  <td className="p-3 w-1/3 text-[#a83232] font-medium text-sm">
                    <div className="flex items-center">
                      <span className="text-[#a83232] mr-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="inline"
                        >
                          <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                          <line x1="16" x2="16" y1="2" y2="6"></line>
                          <line x1="8" x2="8" y1="2" y2="6"></line>
                          <line x1="3" x2="21" y1="10" y2="10"></line>
                        </svg>
                      </span>
                      {formattedDate}
                    </div>
                  </td>
                  <td className="p-3 text-[#0a4b8f] font-medium text-sm line-clamp-2">
                    {notice?.title?.slice(0, 100)}...
                  </td>
                  <td className="p-3 w-10 text-center">
                    <button
                      onClick={() => handleViewNotice(notice.id)}
                      className="inline-flex justify-center items-center"
                    >
                      <Eye className="w-4 h-4 text-blue-500 hover:text-blue-700" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="bg-primary_school text-white p-2 text-center">
        <Link href="/notice" className="inline-flex items-center text-sm ">
          VIEW ALL NOTICE
          <ChevronRight className="ml-1 w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
