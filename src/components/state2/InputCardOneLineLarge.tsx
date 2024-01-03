import { CircularProgress } from '@chakra-ui/react';
import React from 'react'

type Props = {
  loading: boolean;
  title: string;
  require: boolean;
  placeholder: string;
  validate: boolean;
  errorMassage: string;
  value: string;
  onChange: (value: string) => void; // Add onChange prop
};

function InputCardOneLineLarge(props: Props) {
  return (
    <div className='w-[50rem]  h-40 flex flex-col justify-between items-start py-7 px-20 border border-2nd4 rounded-2xl bg-white relative'>
      <p className='text-main2 text-2xl font-bold'>{props.title}</p>
      <div className=' w-full'>
        <input
          onChange={(e) => { props.onChange(e.target.value) }}
          value={props.value}
          placeholder={props.placeholder}
          className={`${!props.validate ? 'border-Act2 text-Act2' : ' text-Act6  border-Act6'} outline-none w-full h-12 pl-5 text-xl placeholder-Act6 placeholder-opacity-30 rounded-md border border-dashed duration-300 relative`}
        ></input>
        {!props.validate &&
          <p className='text-Act2 text-sm absolute duration-300'>{props.errorMassage}</p>
        }

      </div>
      <div
        className={`w-5 h-5 rounded-full border border-main2 absolute right-2 top-2 ${props.require && 'bg-main2'
          }`}
      ></div>
      {props.loading &&
        <div className=' absolute right-[5%] bottom-10  '>
          <CircularProgress isIndeterminate value={30} color={`#3980F3`} thickness='12px' size='20px' />
        </div>
      }
    </div>
  )
}

export default InputCardOneLineLarge