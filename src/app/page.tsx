"use client";

import React from "react";
import Image from "next/image";
import ConnectButton from "@/components/ConnectButton";
import HomeFooter from "@/components/HomeFooter";
import Loading from "@/components/Loading";
import { useState } from "react";

type Props = {};

const Page = ({}: Props) => {
  const [loading, setLoading] = useState(false);
  return (
    <>
      {loading && <Loading />}
      <div className="w-full flex justify-center ">
        <div className="w-full h-full fixed  flex justify-center items-center bg-bg  ">
          <div className="absolute flex top-[25%] z-10">
            <Image
              src="/pic/Logo_Gen2studio.png"
              alt={""}
              width={500}
              height={500}
            ></Image>
          </div>
          <div className="mix-blend-multiply  w-[80rem] h-[80rem] absolute rounded-full bg-gradient-radial from-main1 via-transparent to-transparent left-[5%] top-[30%] z-[-10]"></div>
          <div className="mix-blend-multiply  w-[120rem] h-[120rem] absolute rounded-full bg-gradient-radial from-Act7 via-transparent to-transparent  left-[10%] top-[0%] z-9"></div>
          <div className=" w-[60%] h-[60%] rounded-3xl flex justify-center items-center bg-white absolute top-[50%] z-10">
            <ConnectButton setLoading={setLoading}></ConnectButton>
          </div>
          <div className=" absolute bottom-0 left-0 w-full">
            <HomeFooter></HomeFooter>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
