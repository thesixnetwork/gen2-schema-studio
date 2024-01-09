import React from 'react'
import Image from 'next/image'
import { Spinner } from '@chakra-ui/react'
import white_logo from '../../public/pic/white_logo_six.png'
type Props = {}

function Loading({ }: Props) {
  return (
    <div className='top-0 left-0 w-[100vw] h-[100vh] fixed bg-black z-40 bg-opacity-50  backdrop-blur-sm flex flex-col justify-center items-center'>
      <div className='absolute flex top-[25%] z-50 '>
        <Image src={white_logo} alt={''} width={500} height={500}></Image>
      </div>
      <div className=' absolute scale-[300%] top-[55%]'>
        <Spinner
          thickness='0.5px'
          speed='0.95s'
          color='blue.500'
          size='xl'
        />
      </div>
      <div className=' absolute scale-[300%] top-[55%] '>
        <Spinner
          thickness='0.5px'
          speed='0.7s'
          color='white'
          size='xl'
        />
      </div>
      <p className=' absolute text-5xl font-thin  top-[65%] text-white '>Loading</p>
    </div>
  )
}

export default Loading