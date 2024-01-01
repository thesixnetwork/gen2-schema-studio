import React from 'react';

type Props = {};

function NextPageButton({ }: Props) {
  return (
    <div className="bg-white rounded-md w-[10.2rem] h-[3rem] flex justify-center items-center drop-shadow-lg group cursor-pointer group-hover:scale-110">
      <div className="bg-Act6 duration-300 rounded-md w-[10rem] h-[2.8rem] flex justify-end items-center p-2  group-hover:bg-white group-hover:border-Act6 border">
        <div className="flex items-center justify-between w-[80%]">
          <p className="group-hover:text-Act6 duration-300 text-white text-xl">Next</p>
          <p className="group-hover:text-Act6 duration-300 text-white text-xl">&gt;</p>
        </div>
      </div>
    </div>
  );
}

export default NextPageButton;
