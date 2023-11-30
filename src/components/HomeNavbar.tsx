import { Box } from "@chakra-ui/react";
import logo from "../../public/pic/gen2-logo.png";
import Image from "next/image";

const HomeNavbar = () => {
  return (
      <nav className="flex justify-center w-full min-h-[15vh] relative max-w-[100vw] overflow-x-clip	">
        <Box
          w="80vw"
          h="30vh"
          borderRadius="1630px"
          bgGradient="radial-gradient(42.96% 42.96% at 50% 50%, #9E55BA 0%, rgba(218, 222, 242, 0.00) 82.81%)"
          mixBlendMode="multiply"
          position={"absolute"}
          top={"-50%"}          
          left={"20%"}
          zIndex={-1}
          overflow={"hidden"}
        />
        <Box
          w="80vw"
          h="30vh"
          borderRadius="1630px"
          bgGradient="radial-gradient(42.96% 42.96% at 50% 50%, #79A0EF 0%, rgba(218, 222, 242, 0.00) 82.81%)"
          mixBlendMode="multiply"
          position={"absolute"}
          top={"-50%"}
          left={"48%"}
          zIndex={-1}
          overflow={"hidden"}
        />
        <div className="border  rounded-b-lg text-black w-[95%] bg-white flex items-center px-8">
          <Image src={logo} alt="logo" className="w-32" />
        </div>
      </nav>
  );
};

export default HomeNavbar;
