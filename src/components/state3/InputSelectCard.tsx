import React from 'react';

type Props = {
  title: string;
  require: boolean;
  value: string;
  onChange: (value: string) => void; // Add onChange prop
};

function InputSelectCard(props: Props) {


  return (
    <div className='w-[50rem] h-28 flex justify-between items-center px-20 border border-2nd4 rounded-2xl bg-white relative'>
      <p className='text-main2 text-2xl font-bold'>{props.title}</p>
      <div className='w-[60%]'>

        <div className=' w-96 h-10 flex  items-center    '>
          <div onClick={() => { props.onChange("string") }} className={`w-[50%] h-full border border-Act6 rounded-l-md hover:bg-Act7 hover:text-white hover:border-Act7 cursor-pointer flex justify-center items-center text-xl duration-300 ${props.value === "string" ? "text-white bg-Act6" : " text-Act6 bg-white "}`}>abc</div>
          <div onClick={() => { props.onChange("number") }} className={`w-[50%] h-full border border-Act6  hover:bg-Act7 hover:text-white hover:border-Act7 cursor-pointer flex justify-center items-center text-xl duration-300 ${(props.value === "number" || props.value === "float" ) ? "text-white bg-Act6" : " text-Act6 bg-white "}`}>123</div>
          <div onClick={() => { props.onChange("boolean") }} className={`w-[50%] h-full border border-Act6 rounded-r-md hover:bg-Act7 hover:text-white hover:border-Act7 cursor-pointer flex justify-center items-center text-xl duration-300 ${props.value === "boolean" ? "text-white bg-Act6" : " text-Act6 bg-white "}`}>Y/N</div>
        </div>
      </div>
      <div
        className={`w-5 h-5 rounded-full border border-main2 absolute right-2 top-2 ${props.require && 'bg-main2'
          }`}
      ></div>
    </div>
  );
}

export default InputSelectCard;
