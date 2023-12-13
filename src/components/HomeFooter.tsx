import logo from "../../public/pic/footer-six-network.png";
import helperIcon from "../../public/pic/question.png";
import Image from "next/image";
import HelpButton from "./HelpButton";

const HomeFooter = () => {
  return (
    <div className='w-full bottom-0 left-0 flex justify-between items-center p-10  z-0  bg-gradient-to-t from-white via-transparent to-transparent   '>
      <div>
        <Image src='/pic/SIX_Network_logo.png' alt={''} width={200} height={4}></Image>
      </div>
      <HelpButton></HelpButton>
    </div>
  );
};

export default HomeFooter;
