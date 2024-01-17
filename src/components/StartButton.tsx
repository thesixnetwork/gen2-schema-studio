import { Spinner } from '@chakra-ui/react';
import React from 'react';

type Props = {
  loading?: boolean;
};

function StartPageButton(props: Props) {
  return (
    <div className="bg-white rounded-md w-[10.2rem] h-[3rem] flex justify-center items-center drop-shadow-lg group cursor-pointer group-hover:scale-110">
      <div className="bg-Act6 duration-300 rounded-md w-[10rem] h-[2.8rem] flex justify-center items-center p-2  group-hover:bg-white group-hover:border-Act6 border">
        {props.loading ?
          <div className=' w-full h-full flex justify-center items-center'>
            <Spinner
              className=' text-white group-hover:text-Act6'
              thickness='1px'
              speed='0.95s'
              size='lg'
            />
          </div>
          :
          <div className="flex items-center justify-between ">
            <p className="group-hover:text-Act6 duration-300 text-white text-xl">Start</p>
          </div>
        }
      </div>
    </div>
  );
}

export default StartPageButton;
