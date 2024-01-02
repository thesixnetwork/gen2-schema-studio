'use client';
import React from 'react'
import layer_pic from '../../../public/pic/layer_pic.png'
import Image from 'next/image'
import NextPageButton from '@/components/NextPageButton'
import BackPageButton from '@/components/BackPageButton'
import { useRouter } from 'next/navigation'
type Props = {}

function page({ }: Props) {
    const router = useRouter();
    return (
        <div className=" w-full h-full min-h-[75vh] p-10 flex flex-col justify-between items-center py-10">
            <div className=' px-[10%] w-full flex items-center justify-between'>
                <div className='w-48 h-48 bg-2nd4 rounded-lg border border-Act6 flex justify-center items-center'>
                    <h1 className=' text-6xl text-Act6 font-thin'>NFT</h1>
                </div>
                <div className='text-Act6 text-5xl font-thin'>+</div>
                <div className=' w-48 h-48'>
                    <Image src={layer_pic} alt={''} ></Image>
                </div>
                <div className='text-Act6 text-5xl font-thin'>=</div>
                <div className=' w-48 h-48  bg-2nd4 bg-opacity-70 rounded-lg  flex flex-col justify-center items-center'>
                    <h1 className=' text-6xl text-Act6 font-thin'>NFT</h1>
                    <div className='  absolute mt-32    w-20 h-6 bg-transparent rounded-lg border border-Act6 flex justify-center items-center'>
                        <h1 className=' text-lg text-Act6 '>Gen2</h1>
                    </div>
                </div>
            </div>
            <div className=' w-[90%] h-60 border border-2nd4 rounded-3xl px-10 py-5 flex justify-center items-center text-main2'>
                <p className=' text-xl'><span className="font-bold">Data Layer - NFT Gen 2</span> is designed to empower existing NFTs for various business applications. Its dynamic attributes can be modified on the blockchain with permission, bridging real-world businesses and blockchain technology. It allows for the creation of NFTs that can serve as membership cards, event tickets, health tags for hospitality,
                    and much more. If you want to explore further,<br />
                    <span className="font-bold">please visit NFT Gen 2 for additional information.</span>
                </p>
            </div>
            <div className=' w-[90%] h-20 flex justify-between items-center'>
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

export default page