import type React from 'react';
const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <main className="max-w-7xl mx-auto min-h-[50vh] bg-white shadow-md">{children}</main>
    </>
  );
};

export default layout;
