
import React from 'react'
import Image from "next/image";
import logo from '../../../public/pic/buakaw_collection.png'
import HomeCard from '@/components/HomeCard';
type Props = {}
import getDataTestnet from '@/service/getDataTestnet';

function page({ }: Props) {

  return (
    <div className=' w-full h-full min-h-[600px] px-8 py-10' >
      <HomeCard></HomeCard>
      <button className='text-red-500' onClick={getDataTestnet}>logjuff</button>
    </div>
  )
}

export default page
