import React from 'react'
import Image from "next/image";
import logo from '../../../public/pic/buakaw_collection.png'
import HomeCard from '@/components/HomeCard';
type Props = {}

function page({}: Props) {
  return (
    <div className=' w-full h-full min-h-[600px] px-8' > 
      <HomeCard></HomeCard>
    </div>
  )
}

export default page
