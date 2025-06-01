'use client';

import ImageSkeleton from '@/components/shared/skeleton/ImageSkeleton';
import ParagraphSkeleton from '@/components/shared/skeleton/ParagraphSkeleton';
import TitleSkeleton from '@/components/shared/skeleton/TitleSkeleton';
import { navigation } from '@/data/navigation';
import { useGetList } from '@/hooks/APIHooks';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface HeaderData {
  _id: string;
  logo: string;
  school_name: string;
  address: string;
  eiin: number;
  school_code: number;
  email: string;
  mobile_no: string;
  website: string;
}

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: headerData, isLoading } = useGetList<HeaderData>('/info', 'info');

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 180); // Adjust this value based on the header height
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
    setActiveMenu(null);
  };

  return (
    <div className="flex flex-col w-full">
      <header
        className="py-4 md:py-6 md:pb-8 bg-[#00468C] text-white"
        style={{ backgroundImage: `url("/VideoGallaryBg.png")` }}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="">
              {isLoading ? (
                <ImageSkeleton className="h-16 w-16 md:h-28 md:w-24" />
              ) : (
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${headerData ? headerData[0]?.logo : 'logo/logo.jpg'}`}
                  alt="school logo"
                  width={100}
                  height={100}
                  className="h-16 w-auto md:h-28"
                  priority
                />
              )}
            </div>
            <div className="h-full flex flex-col justify-between items-start grow">
              <div className="text-xl md:text-3xl font-semibold pb-1 md:pb-2">
                {isLoading ? (
                  <TitleSkeleton className="h-5 w-60" />
                ) : (
                  <h1>{headerData && headerData[0]?.school_name}</h1>
                )}
              </div>
              <div className="text-sm md:text-base">
                <div className="text-md">
                  {isLoading ? (
                    <ParagraphSkeleton line={2} />
                  ) : (
                    <p>{headerData && headerData[0]?.address}</p>
                  )}
                </div>
                <p className="text-md">
                  EIIN: {headerData && headerData[0]?.eiin}, Institute Code:{' '}
                  {headerData && headerData[0]?.school_code}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav
        className={`bg-white border-b shadow-lg relative ${
          isSticky ? 'fixed top-0 left-0 right-0 z-50 transition-transform duration-300' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between relative">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-700 hover:text-[#00468C]"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex space-x-1">
              {navigation.mainNav.map((item) => (
                <div
                  key={item.title}
                  className="relative"
                  onMouseEnter={() => setActiveMenu(item.title)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  {item.items ? (
                    <button
                      className={`inline-flex items-center px-3 py-5 text-sm font-medium transition-colors hover:bg-[#00468C] hover:text-white
                      ${activeMenu === item.title ? 'bg-[#00468C] text-white' : 'text-gray-700'}
                    `}
                      aria-expanded={activeMenu === item.title}
                      aria-haspopup="true"
                    >
                      {item.title}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                  ) : (
                    <Link
                      href={item.href || '#'}
                      className={`inline-flex items-center px-3 py-5 text-sm font-medium transition-colors hover:bg-[#00468C] hover:text-white
                      ${activeMenu === item.title ? 'bg-[#00468C] text-white' : 'text-gray-700'}
                    `}
                    >
                      {item.title}
                    </Link>
                  )}
                  {item.items && activeMenu === item.title && (
                    <div
                      className="absolute left-0 mt-0 w-60 bg-white border shadow-lg z-50"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby={`${item.title}-menu`}
                    >
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.title}
                          href={subItem.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#00468C] hover:text-white"
                          role="menuitem"
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile/Tablet Navigation */}
            <div 
              className={`absolute top-full left-0 right-0 bg-white border-b shadow-lg lg:hidden transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
              }`}
              style={{ zIndex: 40 }}
            >
              {navigation.mainNav.map((item) => (
                <div key={item.title} className="relative">
                  {item.items ? (
                    <button
                      onClick={() => setActiveMenu(activeMenu === item.title ? null : item.title)}
                      className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-[#00468C] hover:text-white"
                    >
                      {item.title}
                      <ChevronDown className="float-right h-4 w-4 mt-1" />
                    </button>
                  ) : (
                    <Link
                      href={item.href || '#'}
                      onClick={handleNavClick}
                      className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-[#00468C] hover:text-white"
                    >
                      {item.title}
                    </Link>
                  )}
                  {item.items && activeMenu === item.title && (
                    <div className="bg-gray-50">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.title}
                          href={subItem.href}
                          onClick={handleNavClick}
                          className="block px-6 py-2 text-sm text-gray-700 hover:bg-[#00468C] hover:text-white"
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {/* Mobile/Tablet Login and Application buttons */}
              <div className="border-t py-2">
                <button
                  onClick={() => setActiveMenu(activeMenu === 'login' ? null : 'login')}
                  className="w-full text-left px-4 py-2 text-sm font-medium text-red-600"
                >
                  LOGIN
                  <ChevronDown className="float-right h-4 w-4 mt-1" />
                </button>
                {activeMenu === 'login' && (
                  <div className="bg-gray-50">
                    <a
                      href="https://academichelperbd.com/login"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleNavClick}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#00468C] hover:text-white"
                    >
                      Student/Guardian Login
                    </a>
                    {/* ... existing login items with onClick={handleNavClick} ... */}
                  </div>
                )}
                <Link
                  href="/apply"
                  onClick={handleNavClick}
                  className="block px-4 py-2 text-sm font-medium text-red-600"
                >
                  ONLINE APPLICATION
                </Link>
              </div>
            </div>

            {/* Desktop Login and Application buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <div
                className="relative"
                onMouseEnter={() => setActiveMenu('login')}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800
                    ${activeMenu === 'login' ? 'text-red-800' : ''}
                  `}
                  aria-expanded={activeMenu === 'login'}
                  aria-haspopup="true"
                >
                  LOGIN
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {activeMenu === 'login' && (
                  <div
                    className="absolute right-0 mt-0 w-60 bg-white border shadow-lg z-50"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="login-menu"
                  >
                    <a
                      href="https://academichelperbd.com/login"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#00468C] hover:text-white"
                      role="menuitem"
                    >
                      Student/Guardian Login
                    </a>
                    <a
                      href="https://academichelperbd.com/login"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#00468C] hover:text-white"
                      role="menuitem"
                    >
                      Teacher Login
                    </a>
                    <a
                      href="https://academichelperbd.com/login"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#00468C] hover:text-white"
                      role="menuitem"
                    >
                      Software Login
                    </a>
                    <Link
                      href="/login"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#00468C] hover:text-white"
                      role="menuitem"
                    >
                      Website Admin Login
                    </Link>
                  </div>
                )}
              </div>
              <Link
                href="/apply"
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800"
              >
                ONLINE APPLICATION
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
