import logo from "../../public/pic/Logo_Gen2studio.png";

import Image from "next/image";
import HelpButton from "./HelpButton";

const HomeFooter = () => {
  return (
    <footer className="min-h-[5vh] w-full text-black border-t ">
      <div className="flex justify-between items-center h-full mx-4">
        <Image src={logo} alt="logo" className="w-32" />
        <HelpButton></HelpButton>
      </div>
    </footer>
  );
};

export default HomeFooter;
