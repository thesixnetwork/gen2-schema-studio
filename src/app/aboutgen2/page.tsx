'use client';
import React from 'react'
import layer_pic from '../../../public/pic/layer_pic.png'
import Image from 'next/image'
import NextPageButton from '@/components/NextPageButton'
import BackPageButton from '@/components/BackPageButton'
import { useRouter } from 'next/navigation'
import About_Gen2_Bg from '../../../public/pic/about_gen2_bg.png'
type Props = {}

function Page({ }: Props) {
    const router = useRouter();
    return (
        <div className=" w-full h-full min-h-[75vh]  flex flex-col justify-between items-center pb-4 pt-12">
            <div className=' px-[10%] w-full flex items-center justify-between'>
                <div className='w-48 h-48 bg-2nd4 rounded-lg border border-Act6 flex justify-center items-center'>
                    <h1 className=' text-6xl text-Act6 font-thin'>NFT</h1>
                </div>
                <div className='text-Act6 text-5xl font-thin'>+</div>
                <div className=' w-48 h-48'>
                    <Image src={layer_pic} alt={''} ></Image>
                </div>
                <div className='text-Act6 text-5xl font-thin'>=</div>
                <div className=' w-40 h-40  flex flex-col justify-center items-center'>
                    <div className=' w-40 h-40 bg-white  opacity-60 z-10 absolute  rounded-lg '></div>
                    <div className=' w-64 h-64 absolute z-0'>
                        <Image src={About_Gen2_Bg} alt={''}></Image>
                    </div>
                    <h1 className=' text-6xl text-Act6 font-thin z-10'>NFT</h1>
                    <div className='  w-20 h-6  bg-white  opacity-60 rounded-lg border border-Act6 flex justify-center items-center z-10'>
                        <h1 className=' text-lg text-Act6 '>Gen2</h1>
                    </div>
                </div>
            </div>
            <div className=' w-[90%] h-60 border border-2nd4 rounded-3xl px-10 pb-4 pt-10 flex justify-center items-center text-main2'>
                <p className=' text-xl'><span className="font-bold">Data Layer - NFT Gen 2</span> is designed to empower existing NFTs for various business applications. Its dynamic attributes can be modified on the blockchain with permission, bridging real-world businesses and blockchain technology. It allows for the creation of NFTs that can serve as membership cards, event tickets, health tags for hospitality,
                    and much more. If you want to explore further,<br />
                    <span className="font-bold">please visit NFT Gen 2 for additional information.</span>
                </p>
            </div>
            <div className=' w-[90%]  flex justify-between items-center'>
                <div onClick={() => { router.push(`/class`, { scroll: false }) }}>
                    <BackPageButton></BackPageButton>
                </div>
                <div onClick={() => { router.push(`/newdraft/1/newintegration`, { scroll: false }) }}>
                    <NextPageButton></NextPageButton>
                </div>
            </div>
        </div>
    )
}

export default Page