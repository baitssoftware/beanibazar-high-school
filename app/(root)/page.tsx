'use client';
import ImageSkeleton from '@/components/shared/skeleton/ImageSkeleton';
import ParagraphSkeleton from '@/components/shared/skeleton/ParagraphSkeleton';
import { useGetList } from '@/hooks/APIHooks';
import Image from 'next/image';
import Link from 'next/link';
import AllNotices from './components/home/AllNotice';
import InstituteSidebar from './components/home/InstituteInformation';
import Notice from './components/home/Notice';
import NoticeSection from './components/notice/NoticeSection';
import ImageSlider from './components/slider/ImageSlider';

interface HistoryData {
  _id: string;
  title: string;
  image: string;
  description: string;
}

const Home = () => {
  const { data: historyData, isLoading } = useGetList<HistoryData>('/history', 'history');
  const history = historyData && historyData[0];
  return (
    <section>
      <NoticeSection />
      <section className="space-y-6">
        <div className="grid grid-cols-11 gap-4 py-4 ">
          <div className="col-span-2 text-center border border-primary_school py-2.5 flex flex-col items-center justify-around shadow-xl shadow-primary_school/10">
            <div className="mx-auto flex flex-col items-center justify-center ">
              <Image
                src={'/chairman.jpg'}
                alt="school logo"
                width={100}
                height={100}
                className="h-32 w-auto mb-4"
              />

              <p className="text-sm px-2">
                মাওলানা ফয়জুল ইসলাম <br />
                চেয়ারম্যান, জিলালুল কুরআন সোসাইটি
              </p>
            </div>
            {/* Divider */}
            <div className="w-full h-0.5 bg-gray-200"></div>
            <div className="mx-auto flex flex-col items-center justify-center mt-5\pt-3">
              <Image
                src={'/chairman.jpg'}
                alt="school logo"
                width={100}
                height={100}
                className="h-32 w-auto mb-4"
              />

              <p className="text-sm px-2">
                মোঃ রুকন উদ্দিন, <br />
                প্রধান শিক্ষক
              </p>
            </div>
          </div>
          <div className="col-span-6 shadow-xl shadow-primary_school/10 border border-primary_school">
            <ImageSlider />
          </div>
          <div className="col-span-3 shadow-xl shadow-primary_school/10 border border-primary_school">
            <Notice />
          </div>
        </div>
        <div className="w-full h-0.5 bg-gray-200"></div>
        <div className="grid grid-cols-12 gap-4 py-4">
          <div className="col-span-12 md:col-span-3 shadow-xl shadow-primary_school/10">
            <InstituteSidebar />
          </div>
          <div className="col-span-12 md:col-span-6  shadow-xl shadow-primary_school/10 border border-primary_school">
            <AllNotices />
          </div>
          <div className="col-span-12 md:col-span-3 shadow-xl shadow-primary_school/10 border border-primary_school">
            <div className="">
              <h2 className="heading">Emergency Hotline</h2>
              <Image
                src={'/hotlineseba.png'}
                alt="notice"
                width={100}
                height={100}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
        {/* Divider */}
        <div className="w-full h-0.5 bg-gray-200"></div>
        {/* others section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {/* About School */}
          <div className="shadow-xl shadow-primary_school/10 border border-primary_school">
            <h2 className="heading">About School</h2>
            <div className="p-4 overflow-hidden">
              {isLoading ? (
                <ImageSkeleton className="h-40 w-11/12 mx-auto" />
              ) : (
                <div className="float-left mr-4 w-1/3">
                  <div className="bg-yellow-100 p-2">
                    {history?.image && (
                      <Image
                        priority
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${history.image}`}
                        alt="school building"
                        width={150}
                        height={100}
                        className="w-full h-28 my-2"
                      />
                    )}
                    {/* <p className="text-xs text-center">স্থাপিত: ০২-০১-২০১৮</p> */}
                  </div>
                </div>
              )}

              <div>
                {isLoading ? (
                  <p className="text-sm mb-3">
                    <ParagraphSkeleton line={6} />
                  </p>
                ) : (
                  <p className="text-sm mb-3">{history?.description?.slice(0, 450)}</p>
                )}

                <Link
                  href="/history"
                  className="bg-yellow-400 text-xs px-2 py-1 rounded-full inline-block"
                >
                  Read More →
                </Link>
              </div>
            </div>
          </div>

          {/* Features of School */}
          <div className="shadow-xl shadow-primary_school/10 border border-primary_school">
            <h2 className="heading">News & Events</h2>
            <div className="p-4 overflow-hidden">
              <Image
                src={'/feature.jpg'}
                alt="News event"
                width={150}
                height={120}
                className="float-left mr-4 w-1/3 h-auto object-cover border border-gray-200"
              />
              <div>
                <h3 className="text-base font-medium mb-1">মাসিক সংবর্ধনা....</h3>
                <p className="text-xs text-gray-500 mb-1">Published: May 29, 2022</p>
                <p className="text-sm mb-3">
                  বিদ্যালয়ের কর্মকর্তাদের সম্মানিত বাবা-মা সন্তানদের সকলকে জানাচ্ছি যেমন ভাবে আগে
                  বলা হয়েছে যে প্রতিষ্ঠানে ভর্তিকৃত শিক্ষার্থীদের মাসিক সংবর্ধনা অনুষ্ঠান হয়েছে।
                  এক নজরে বিয়ানীবাজার জামেয়া ইসলামিয়া উচ্চ বিদ্যালয় পড় তোমার রবের নামে যিনি
                  তোমাকে সৃষ্টি করেছেন।
                </p>
                <a
                  href="#"
                  className="text-nowrap bg-yellow-400 text-xs px-2 py-1 rounded-full inline-block"
                >
                  Read More →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* News & Events and Achievements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {/* News & Events */}
          <div className="shadow-xl shadow-primary_school/10 border border-primary_school">
            <h2 className="heading">News & Events</h2>
            <div className="">
              {/* News Item 1 */}
              <div className="p-4 overflow-hidden">
                <Image
                  src={'/feature.jpg'}
                  alt="News event"
                  width={150}
                  height={120}
                  className="float-left mr-4 w-1/3 h-auto object-cover border border-gray-200"
                />
                <div>
                  <h3 className="text-base font-medium mb-1">মাসিক সংবর্ধনা....</h3>
                  <p className="text-xs text-gray-500 mb-1">Published: May 29, 2022</p>
                  <p className="text-sm mb-3">
                    বিদ্যালয়ের কর্মকর্তাদের সম্মানিত বাবা-মা সন্তানদের সকলকে জানাচ্ছি যেমন ভাবে আগে
                    বলা হয়েছে যে প্রতিষ্ঠানে ভর্তিকৃত শিক্ষার্থীদের মাসিক সংবর্ধনা অনুষ্ঠান হয়েছে।
                    এক নজরে বিয়ানীবাজার জামেয়া ইসলামিয়া উচ্চ বিদ্যালয় পড় তোমার রবের নামে যিনি
                    তোমাকে সৃষ্টি করেছেন।
                  </p>
                  <a
                    href="#"
                    className="text-nowrap bg-yellow-400 text-xs px-2 py-1 rounded-full inline-block"
                  >
                    Read More →
                  </a>
                </div>
              </div>

              <div className="border-t border-gray-200 my-3"></div>

              {/* News Item 2 */}
              <div className="p-4 overflow-hidden">
                <Image
                  src={'/feature.jpg'}
                  alt="News event"
                  width={150}
                  height={120}
                  className="float-left mr-4 w-1/3 h-auto object-cover border border-gray-200"
                />
                <div>
                  <h3 className="text-base font-medium mb-1">মাসিক সংবর্ধনা....</h3>
                  <p className="text-xs text-gray-500 mb-1">Published: May 29, 2022</p>
                  <p className="text-sm mb-3">
                    বিদ্যালয়ের কর্মকর্তাদের সম্মানিত বাবা-মা সন্তানদের সকলকে জানাচ্ছি যেমন ভাবে আগে
                    বলা হয়েছে যে প্রতিষ্ঠানে ভর্তিকৃত শিক্ষার্থীদের মাসিক সংবর্ধনা অনুষ্ঠান হয়েছে।
                    এক নজরে বিয়ানীবাজার জামেয়া ইসলামিয়া উচ্চ বিদ্যালয় পড় তোমার রবের নামে যিনি
                    তোমাকে সৃষ্টি করেছেন।
                  </p>
                  <a
                    href="#"
                    className="text-nowrap bg-yellow-400 text-xs px-2 py-1 rounded-full inline-block"
                  >
                    Read More →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="shadow-xl shadow-primary_school/10 border border-primary_school">
            <h2 className="heading">Achievements</h2>
            <div className="">
              {/* Achievement Item 1 */}
              <div className="p-4 overflow-hidden">
                <Image
                  src={'/feature.jpg'}
                  alt="News event"
                  width={150}
                  height={120}
                  className="float-left mr-4 w-1/3 h-auto object-cover border border-gray-200"
                />
                <div>
                  <h3 className="text-base font-medium mb-1">মাসিক সংবর্ধনা....</h3>
                  <p className="text-xs text-gray-500 mb-1">Published: May 29, 2022</p>
                  <p className="text-sm mb-3">
                    বিদ্যালয়ের কর্মকর্তাদের সম্মানিত বাবা-মা সন্তানদের সকলকে জানাচ্ছি যেমন ভাবে আগে
                    বলা হয়েছে যে প্রতিষ্ঠানে ভর্তিকৃত শিক্ষার্থীদের মাসিক সংবর্ধনা অনুষ্ঠান হয়েছে।
                    এক নজরে বিয়ানীবাজার জামেয়া ইসলামিয়া উচ্চ বিদ্যালয় পড় তোমার রবের নামে যিনি
                    তোমাকে সৃষ্টি করেছেন।
                  </p>
                  <a
                    href="#"
                    className="text-nowrap bg-yellow-400 text-xs px-2 py-1 rounded-full inline-block"
                  >
                    Read More →
                  </a>
                </div>
              </div>

              <div className="border-t border-gray-200 my-3"></div>

              {/* Achievement Item 2 */}
              <div className="p-4 overflow-hidden">
                <Image
                  src={'/feature.jpg'}
                  alt="News event"
                  width={150}
                  height={120}
                  className="float-left mr-4 w-1/3 h-auto object-cover border border-gray-200"
                />
                <div>
                  <h3 className="text-base font-medium mb-1">মাসিক সংবর্ধনা....</h3>
                  <p className="text-xs text-gray-500 mb-1">Published: May 29, 2022</p>
                  <p className="text-sm mb-3">
                    বিদ্যালয়ের কর্মকর্তাদের সম্মানিত বাবা-মা সন্তানদের সকলকে জানাচ্ছি যেমন ভাবে আগে
                    বলা হয়েছে যে প্রতিষ্ঠানে ভর্তিকৃত শিক্ষার্থীদের মাসিক সংবর্ধনা অনুষ্ঠান হয়েছে।
                    এক নজরে বিয়ানীবাজার জামেয়া ইসলামিয়া উচ্চ বিদ্যালয় পড় তোমার রবের নামে যিনি
                    তোমাকে সৃষ্টি করেছেন।
                  </p>
                  <a
                    href="#"
                    className="text-nowrap bg-yellow-400 text-xs px-2 py-1 rounded-full inline-block"
                  >
                    Read More →
                  </a>
                </div>
              </div>

              <div className="border-t border-gray-200 my-3"></div>

              {/* Achievement Item 3 */}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-0.5 bg-gray-200"></div>

        {/* Why Choose */}
        <div className="py-4">
          <h2 className="heading">Why Choose</h2>
          <div className="p-4 flex justify-center gap-4">
            <div className="hexagon-image">
              <Image
                src={'/why-choose-1.jpg'}
                alt="why choose"
                width={120}
                height={120}
                className="w-full h-auto"
              />
            </div>
            <div className="hexagon-image">
              <Image
                src={'/why-choose-2.jpg'}
                alt="why choose"
                width={120}
                height={120}
                className="w-full h-auto"
              />
            </div>
            <div className="hexagon-image">
              <Image
                src={'/why-choose-3.jpg'}
                alt="why choose"
                width={120}
                height={120}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-0.5 bg-gray-200"></div>

        {/* Gallery */}
        <div className="py-4">
          <h2 className="heading">গ্যালারি</h2>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-primary_school">
              <Image
                src={'/1653844463.jpg'}
                alt="gallery"
                width={400}
                height={300}
                className="w-full h-auto"
              />
            </div>
            <div className="border border-primary_school">
              <Image
                src={'/1653844463.jpg'}
                alt="gallery"
                width={400}
                height={300}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default Home;
