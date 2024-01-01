import { Box } from "@chakra-ui/react";
import logo from "../../public/pic/Logo_Gen2studio.png";
import Image from "next/image";
import UserDashboard from "./UserDashboard";

const HomeNavbar = () => {
  return (
    <nav className="flex justify-center w-full min-h-[15vh] relative ">
      {/* <div className='mix-blend-multiply  w-[90rem] h-[40rem] absolute rounded-full bg-gradient-radial from-main1 via-transparent to-transparent right-[5%] top-[-240%] z-[0]'></div>
      <div className='mix-blend-multiply  w-[90rem] h-[50rem] absolute rounded-full bg-gradient-radial from-Act7 via-transparent to-transparent  right-[-15%] top-[-290%] z-[0]'></div> */}
      <div className="border  rounded-b-lg text-black w-[95%] bg-white flex justify-between items-center px-8 z-[1]">
        <Image src={logo} alt="logo" className=" w-60" />
        <UserDashboard></UserDashboard>
      </div>
    </nav>
  );
};

export default HomeNavbar;
