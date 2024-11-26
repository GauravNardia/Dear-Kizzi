import React from "react";
import Image from "next/image";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <section className="hidden w-1/2 items-center justify-center bg-brand p-10 lg:flex xl:w-2/5">
        <div className="flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-12">

          <div className="space-y-5 text-white">
            <h1 className="h1">Write, share and connect with your true match</h1>
            <p className="body-1">
            Open your heart with letters, voice, and real life experience that build real bonds.

            </p>
          </div>
          {/* <Image
            src="/assets/love.avif"
            alt="Files"
            width={342}
            height={342}
            className="transition-all rounded-full hover:rotate-2 hover:scale-105"
          /> */}
        </div>
      </section>

      <section className="flex flex-1 flex-col items-center bg-white p-4 py-10 lg:justify-center lg:p-10 lg:py-0">
        <div className="mb-16 lg:hidden">
          <Image
            src="/logo.svg"
            alt="logo"
            width={100}
            height={80}
            className="h-auto w-[100px] lg:w-[250px]"
          />
        </div>

        {children}
      </section>
    </div>
  );
};

export default Layout;