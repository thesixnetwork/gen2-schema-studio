import logo from "../../public/pic/footer-six-network.png";
import helperIcon from "../../public/pic/question.png";
import Image from "next/image";

const HomeFooter = () => {
  return (
    <footer className="min-h-[5vh] w-full text-black border-t ">
      <div className="flex justify-between items-center h-full mx-4">
        <Image src={logo} alt="logo" className="w-32" />
        <Image src={helperIcon} alt="helper" className="w-8 hover:scale-125 duration-300 cursor-pointer" />
      </div>
    </footer>
  );
};

export default HomeFooter;
