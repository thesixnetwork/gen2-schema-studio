import React from 'react'
import Image from 'next/image';
import p from '../../public/pic/Help_Icon.png'
import HelpButton from '@/components/HelpButton';
import ConnectButton from '@/components/ConnectButton';
import HomeFooter from '@/components/HomeFooter';
import Loading from '@/components/Loading';



type Props = {}

function connectPage({ }: Props) {
    return (
        <div className='w-full flex justify-center  ' >
            <div className='w-full h-full fixed  flex justify-center items-center bg-bg '>
               {/* <Loading></Loading> */}
                <div className='absolute flex top-[25%] z-10'>
                    <Image src='/pic/Logo_Gen2studio.png' alt={''} width={500} height={500}></Image>
                </div>
                <div className='mix-blend-multiply  w-[80rem] h-[80rem] absolute rounded-full bg-gradient-radial from-main1 via-transparent to-transparent left-[5%] top-[30%] z-[-10]'></div>
                <div className='mix-blend-multiply  w-[120rem] h-[120rem] absolute rounded-full bg-gradient-radial from-Act7 via-transparent to-transparent  left-[10%] top-[0%] z-9'></div>
                <div className=' w-[60%] h-[60%] rounded-3xl flex justify-center items-center bg-white absolute top-[50%] z-10'>
                    <ConnectButton></ConnectButton>
                </div>
                <div className=' absolute bottom-0 left-0 w-full'>
                    <HomeFooter></HomeFooter>
                </div>
            </div>
        </div>
    )
}

export default connectPage