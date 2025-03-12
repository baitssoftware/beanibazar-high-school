'use client';

import TitleSkeleton from '@/components/shared/skeleton/TitleSkeleton';
import { useGetList } from '@/hooks/APIHooks';
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

const Contact = () => {
  const { data: headerData, isLoading } = useGetList<HeaderData>('/info', 'info');
  return (
    <section>
      <h2 className="heading">Contact Us</h2>
      <div className="grid grid-cols-3 gap-4 py-6">
        <div className="px-10 py-6 border">
          <h2 className="text-2xl font-semibold underline underline-offset-8 pb-4">
            Institute Address:
          </h2>
          <p className="">
            {isLoading ? (
              <TitleSkeleton className="h-5 w-60" />
            ) : (
              <span>{headerData && headerData[0].address}</span>
            )}
          </p>
        </div>
        <div className="px-10 py-6 border">
          <h2 className="text-2xl font-semibold underline underline-offset-8 pb-4">
            Web & Email Address:
          </h2>
          <p className="">{isLoading ? 'Loading...' : headerData && headerData[0].website}</p>
        </div>
        <div className="px-10 py-6 border">
          <h2 className="text-2xl font-semibold underline underline-offset-8 pb-4">
            Contact Number:
          </h2>
          <p className="">{isLoading ? 'Loading...' : headerData && headerData[0].mobile_no}</p>
        </div>
      </div>
      <div className="pb-16">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3621.227230512309!2d92.13851657604604!3d24.82190164679812!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3751b58b9410d467%3A0x2b7e203c9d8f2dc2!2sBGB%20Beanibazar%20(52%20Battalion)!5e0!3m2!1sen!2sbd!4v1741763364419!5m2!1sen!2sbd"
          className="w-full"
          height="450"
          style={{ border: 0 }}
          loading="lazy"
        ></iframe>
      </div>
    </section>
  );
};

export default Contact;
