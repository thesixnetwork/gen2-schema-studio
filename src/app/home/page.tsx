import React from 'react'
import Image from "next/image";
import logo from '../../../public/pic/buakaw_collection.png'
type Props = {}

function page({}: Props) {
  return (
    <div className=' bg-bg w-full h-full min-h-[600px]' >
      <Image src={logo} alt={''} width={300} ></Image>
      <Image src={logo} alt={''} width={300}></Image>
      <Image src={logo} alt={''} width={300}></Image>

    </div>
  )
}

export default page
