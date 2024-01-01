import React from 'react'
import Image from 'next/image';
type Props = {}

function HelpButton({ }: Props) {
    return (
        <div className=' w-10 h-10 rounded-md border border-main2 hover:scale-125 duration-500 cursor-pointer shadow-2xl'>
            <Image src="/pic/Help_Icon.png" alt={''} width={50} height={50}  ></Image>
        </div>
    )
}

export default HelpButton