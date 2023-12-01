import { Box } from "@chakra-ui/react";
import logo from "../../public/pic/Logo_Gen2studio.png";
import Image from "next/image";
import UserDashboard from "./UserDashboard";

const HomeNavbar = () => {
  return (
    <nav className="flex justify-center w-full min-h-[15vh] relative">
      {/* <Box
        w="1630px"
        h="374px"
        borderRadius="1630px"
        bgGradient="radial-gradient(42.96% 42.96% at 50% 50%, #9E55BA 0%, rgba(218, 222, 242, 0.00) 82.81%)"
        mixBlendMode="multiply"
        position={"absolute"}
        top={"-140%"}
        left={"0%"}
        zIndex={-1}
        overflow={"hidden"}
      />
      <Box
        w="1630px"
        h="374px"
        borderRadius="1630px"
        bgGradient="radial-gradient(42.96% 42.96% at 50% 50%, #79A0EF 0%, rgba(218, 222, 242, 0.00) 82.81%)"
        mixBlendMode="multiply"
        position={"absolute"}
        top={"-140%"}
        left={"24%"}
        zIndex={-1}
        overflow={"hidden"}
      /> */}
      <div className="border  rounded-b-lg text-black w-[95%] bg-white flex justify-between items-center px-8">
        <Image src={logo} alt="logo" className=" w-60" />
        <UserDashboard></UserDashboard>
      </div>
    </nav>
  );
};

export default HomeNavbar;
