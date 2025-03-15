'use client';
import ImageSkeleton from '@/components/shared/skeleton/ImageSkeleton';
import ParagraphSkeleton from '@/components/shared/skeleton/ParagraphSkeleton';
import TitleSkeleton from '@/components/shared/skeleton/TitleSkeleton';
import { useGetList } from '@/hooks/APIHooks';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import AllNotices from './components/home/AllNotice';
import ImageNVideoGallery from './components/home/ImageNVideoGallery';
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
interface Feature {
  id: string;
  title: string;

  description: string;
  image: string;
}
interface TNewsData {
  _id: string;
  image: string;
  title: string;
  description: string;
  createdAt: string;
}
interface IAchievementData {
  _id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  year: string;
}
interface ChairmanMessage {
  _id: string;
  message: string;
  image: string;
  name: string;
  facebookURL?: string;
  instagramURL?: string;
  tweeterURL?: string;
  youtubeURL?: string;
}
interface PrincipalMessage {
  _id: string;
  message: string;
  image: string;
  name: string;
  facebookURL?: string;
  instagramURL?: string;
  tweeterURL?: string;
  youtubeURL?: string;
}

const Home = () => {
  const { data: historyData, isLoading } = useGetList<HistoryData>('/history', 'history');
  const history = historyData && historyData[0];
  const { data: features, isLoading: isFeaturesLoading } = useGetList<Feature>(
    '/features',
    'features',
  );
  const { data: schoolEvents, isLoading: isNewsEventsLoading } = useGetList<TNewsData>(
    '/news-events',
    'news-events',
  );
  const { data: achievements, isLoading: isAchievementsLoading } = useGetList<IAchievementData>(
    '/achievements',
    'achievements',
  );
  const { data: chairmanData, isLoading: isChairmanLoading } = useGetList<ChairmanMessage>(
    '/chairman-message',
    'chairman-message',
  );
  const chairmanMessage = chairmanData?.[0];
  const { data: principalData, isLoading: isPrincipalLoading } = useGetList<PrincipalMessage>(
    '/principal-message',
    'principal-message',
  );
  const principalMessage = principalData?.[0];
  if (isLoading) {
    return (
      <div className="w-screen h-screen bg-gray-200 flex justify-center items-center fixed top-0 left-0 z-50">
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
  return (
    <section>
      <NoticeSection />
      <section className="space-y-6">
        <div className="grid grid-cols-11 gap-4 py-4 ">
          <div className="col-span-2 text-center border border-primary_school py-2.5 flex flex-col items-center justify-around shadow-xl shadow-primary_school/10">
            <div className="mx-auto flex flex-col items-center justify-center ">
              {isChairmanLoading ? (
                <ImageSkeleton className="h-32 w-auto mb-4" />
              ) : (
                <Image
                  src={
                    `${process.env.NEXT_PUBLIC_IMAGE_URL}/${chairmanMessage?.image}` ||
                    '/placeholder.svg'
                  }
                  priority
                  alt={`Image of ${chairmanMessage?.name}`}
                  width={100}
                  height={100}
                  className="h-32 w-auto mb-4"
                />
              )}

              <p className="text-sm px-2">
                {isChairmanLoading ? (
                  <TitleSkeleton className="h-5 w-60" />
                ) : (
                  <h1>{chairmanMessage?.name}</h1>
                )}
                চেয়ারম্যান, জিলালুল কুরআন সোসাইটি
              </p>
            </div>
            {/* Divider */}
            <div className="w-full h-0.5 bg-gray-200"></div>
            <div className="mx-auto flex flex-col items-center justify-center mt-5\pt-3">
              {isPrincipalLoading ? (
                <ImageSkeleton className="h-32 w-auto mb-4" />
              ) : (
                <Image
                  priority
                  src={
                    `${process.env.NEXT_PUBLIC_IMAGE_URL}/${principalMessage?.image}` ||
                    '/placeholder.svg'
                  }
                  alt={principalMessage?.name || 'Principal'}
                  width={100}
                  height={100}
                  className="h-32 w-auto mb-4"
                />
              )}

              <p className="text-sm px-2">
                {isPrincipalLoading ? (
                  <TitleSkeleton className="h-5 w-60" />
                ) : (
                  <h1>{principalMessage?.name}</h1>
                )}
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
                <div className="p-4 overflow-hidden grid grid-cols-5 gap-4">
                  <div className="col-span-2">
                    <ImageSkeleton className="h-40 w-11/12 mx-auto" />
                  </div>
                  <div className="col-span-3">
                    <ParagraphSkeleton line={6} />
                  </div>
                </div>
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
                        className="float-left mr-4 w-1/3 h-auto object-cover border border-gray-200"
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
            <h2 className="heading"> Features of School</h2>
            <div className="p-4 overflow-hidden">
              {isFeaturesLoading ? (
                <div className="p-4 overflow-hidden grid grid-cols-5 gap-4">
                  <div className="col-span-2">
                    <ImageSkeleton className="h-40 w-11/12 mx-auto" />
                  </div>
                  <div className="col-span-3">
                    <ParagraphSkeleton line={6} />
                  </div>
                </div>
              ) : (
                <div className="float-left mr-4 w-1/3">
                  <div className="bg-yellow-100 p-2">
                    {features && features[0]?.image && (
                      <Image
                        priority
                        src={
                          features
                            ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${features[0]?.image}`
                            : '/feature.jpg'
                        }
                        alt="school building"
                        width={150}
                        height={100}
                        className="w-full h-28 my-2"
                      />
                    )}
                  </div>
                </div>
              )}

              <div>
                {isFeaturesLoading ? (
                  <p className="text-sm mb-3">
                    <ParagraphSkeleton line={6} />
                  </p>
                ) : (
                  <p className="text-sm mb-3">
                    {features && features[0]?.description.slice(0, 450)}...
                  </p>
                )}
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
              {isNewsEventsLoading ? (
                <div className="p-4 overflow-hidden grid grid-cols-5 gap-4">
                  <div className="col-span-2">
                    <ImageSkeleton className="h-40 w-11/12 mx-auto" />
                  </div>
                  <div className="col-span-3">
                    <ParagraphSkeleton line={6} />
                  </div>
                </div>
              ) : (
                <Link href={'/about/news-events'}>
                  {schoolEvents?.slice(0, 2).map((sEvent, idx) => (
                    <div
                      className={cn(
                        'p-4 overflow-hidden',
                        idx !== schoolEvents?.length && 'border-b',
                      )}
                      key={idx}
                    >
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${sEvent ? sEvent?.image : 'logo/logo.jpg'}`}
                        alt="News event"
                        width={150}
                        height={120}
                        className="float-left mr-4 w-1/3 h-2/3 object-cover border border-gray-200"
                      />
                      <div>
                        <h3 className="text-base font-medium mb-1">{sEvent?.title}</h3>
                        <p className="text-xs text-gray-500 mb-1">
                          Published:{new Date(sEvent?.createdAt).toLocaleDateString()}
                        </p>

                        <p className="text-sm mb-3">{sEvent?.description.slice(0, 450)}...</p>
                        <a
                          href="#"
                          className="text-nowrap bg-yellow-400 text-xs px-2 py-1 rounded-full inline-block"
                        >
                          Read More →
                        </a>
                      </div>
                    </div>
                  ))}
                </Link>
              )}
            </div>
          </div>

          {/* Achievements */}
          <div className="shadow-xl shadow-primary_school/10 border border-primary_school">
            <h2 className="heading">Achievements</h2>
            <div className="">
              {isAchievementsLoading ? (
                <div className="p-4 overflow-hidden grid grid-cols-5 gap-4">
                  <div className="col-span-2">
                    <ImageSkeleton className="h-40 w-11/12 mx-auto" />
                  </div>
                  <div className="col-span-3">
                    <ParagraphSkeleton line={6} />
                  </div>
                </div>
              ) : (
                <Link href={'/about/achievements'}>
                  {achievements?.slice(0, 2).map((achievement, idx) => (
                    <div
                      className={cn(
                        'p-4 overflow-hidden',
                        idx !== 0 && 'border-t border-gray-200 mt-3',
                      )}
                      key={achievement._id}
                    >
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${achievement.image}`}
                        alt={achievement.title}
                        width={150}
                        height={120}
                        className="float-left mr-4 w-1/3 h-auto object-cover border border-gray-200"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg?height=120&width=150';
                        }}
                      />
                      <div>
                        <h3 className="text-base font-medium mb-1">{achievement.title}</h3>
                        <div className="flex gap-2 mb-1">
                          <p className="text-xs text-gray-500">
                            {achievement.category && (
                              <span className="capitalize bg-yellow-100 px-2 py-0.5 rounded-full">
                                {achievement.category}
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500">
                            {achievement.year && (
                              <span className="bg-blue-100 px-2 py-0.5 rounded-full">
                                {achievement.year}
                              </span>
                            )}
                          </p>
                        </div>
                        <p className="text-sm mb-3">
                          {achievement.description.length > 200
                            ? `${achievement.description.slice(0, 200)}...`
                            : achievement.description}
                        </p>
                        <a
                          href={`/about/achievements/${achievement._id}`}
                          className="text-nowrap bg-yellow-400 text-xs px-2 py-1 rounded-full inline-block"
                        >
                          Read More →
                        </a>
                      </div>
                    </div>
                  ))}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        {/* <div className="w-full h-0.5 bg-gray-200"></div> */}

        {/* Why Choose */}
        {/* <div className="py-4">
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
        </div> */}

        {/* Divider */}
        <div className="w-full h-0.5 bg-gray-200"></div>

        {/* Gallery */}
        <ImageNVideoGallery />
      </section>
    </section>
  );
};

export default Home;
