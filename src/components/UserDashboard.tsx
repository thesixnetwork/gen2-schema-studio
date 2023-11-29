import React from 'react'
import Image from "next/image";
import arrow from '../../public/pic/ArrowUpRight.png'
import logout from '../../public/pic/Logout.png'
import kepl_icon from '../../public/pic/Keplr_Icon.png'
import copy_icon from '../../public/pic/Copy_icon.png'
import six_icon from '../../public/pic/SIX_Token_Icon .png'
import createDown_icon from '../../public/pic/CaretDown_icon.png'
type Props = {}

function UserDashboard({ }: Props) {
    return (
        <div className=' w-80 h-32 border-2nd4 border rounded-lg justify-between px-3 py-1'>
            <div className=' h-[60%]'>
                <div className=' h-[50%] flex items-center justify-between'>
                    <div className=' flex justify-between items-center w-[50%]'>
                        <Image src={kepl_icon} width={25} height={25} alt={''}></Image>
                        <p>6x1walzr...hnzf</p>
                    </div>
                    <div className='hover:scale-110 cursor-pointer duration-500'>
                        <Image src={copy_icon} alt={''} width={25} height={25}></Image>
                    </div>
                </div>
                <div className=' h-[50%] flex items-center justify-between'>
                    <div className=' flex justify-between items-center w-[30%]'>
                        <Image src={six_icon} width={25} height={25} alt={''}></Image>
                        <p>123.45</p>
                    </div>
                    <div className=' flex justify-between items-center w-[30%]'>
                        <p>Fivenet</p>
                        <div className='hover:scale-110 cursor-pointer duration-500'>
                            <Image src={createDown_icon} width={25} height={25} alt={''}></Image>
                        </div>
                    </div>
                </div>
            </div>
            <div className=' w-full border-2nd4 border'></div>
            <div className=' h-[40%] flex items-center justify-between w-full'>
                <div className=' flex items-center justify-between w-[23%] hover:scale-110 cursor-pointer duration-500'>
                    <Image src={arrow} alt={''} width={25} height={25}></Image>
                    <p>View</p>
                </div>
                <div className=' flex items-center justify-between w-[41%] hover:scale-110 cursor-pointer duration-500'>
                    <Image src={logout} alt={''} width={25} height={25}></Image>
                    <p>Disconnect</p>
                </div>

            </div>
        </div>
    )
}

export default UserDashboard