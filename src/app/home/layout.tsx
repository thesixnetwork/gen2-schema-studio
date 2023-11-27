"use client";

import HomeFooter from "@/components/HomeFooter";
import HomeNavBar from "@/components/HomeNavbar";
import HomeSidebar from "@/components/HomeSidebar";
import { useState,useEffect } from "react";
interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
      <main className="w-full flex flex-col justify-between item sticky h-[100vh]">

        {isClient && <HomeNavBar />}
        {/* <HomeNavBar /> */}
        <div className="flex flex-grow justify-between mt-[15vh] ">
          <section>{children}</section>
          {isClient && <HomeSidebar />}
          {/* <Sidebar /> */}
        </div>
        {isClient && <HomeFooter />}
        {/* <HomeFooter /> */}
      </main>
  );
};

export default RootLayout;
