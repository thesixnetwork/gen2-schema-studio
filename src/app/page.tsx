"use client";
import React, { useEffect } from 'react'
import Link from "next/link";
import WhiteBox from '@/components/WhiteBox'
import axios from 'axios'
import { useAccount } from "graz";
import { Center, HStack, Spacer, Stack, Text } from "@chakra-ui/react";

const Home = () => {

    return (
        <div className='w-full flex justify-center' >
            <div className='w-full h-full fixed  flex justify-center items-center bg-gradient-24  from-white to-[#7A8ED7]'>
                <div className='w-[1280px] h-[832px] bg-gradient-24 to-gray-700 from-gray-300 rounded-2xl flex p-4  shadow-lg shadow-black/20 dark:shadow-black/40'>
                    <div className='h-full w-4/6 flex flex-col pl-[50px]'>
                        <p className='text-[#FFFFFF] text-3xl mb-1'>Draft</p>
                        <div className='w-[891px] h-[1px] bg-[#D9D9D9]'></div>
                        <div className='flex mt-2'>
                            <Link href={`/newintregation/1`} className='w-[197px] h-[232px] mt-[30px] ml-3 border rounded-2xl flex justify-center items-center hover:scale-105 duration-500 cursor-pointer'>
                                <p className='text-white text-2xl hover:text-[#d2d3d7] duration-500 '>New Intregation</p>
                            </Link >
                            <Link href={`/draft`}  className='w-[197px] h-[232px] mt-[30px] ml-3 border rounded-2xl flex justify-center items-center hover:scale-105 duration-500 cursor-pointer'>
                                <p>test</p>
                            </Link>
                        </div>
                        <p className='text-[#FFFFFF] text-3xl mt-[80px] mb-1 '>Live</p>
                        <div className='w-[891px] h-[1px] bg-[#D9D9D9]'></div>
                        <div className='mt-[30px] flex '>
                            <div className='flex flex-col justify-center items-center cursor-pointer'>
                                <div className=' flex  items-end hover:scale-105 duration-500 shadow-lg shadow-black/20 dark:shadow-black/40'>
                                    <img src={'/pic/buakaw_collection.png'} className='w-[197px] h-[232px] border-[#D9D9D9] border-[0.5px] rounded-2xl  '></img>
                                    <div className='w-[197px] h-[69px] bg-[#D9D9D9]/[0.8] rounded-b-2xl absolute flex flex-row justify-center items-center'>
                                        <img src={'/pic/eth_logo.png'} className='mr-2'></img>
                                        <p className='text-[#100072] text-[20px]  '>2000 Items</p>
                                    </div>
                                </div>
                                <p className='text-white text-2xl font-bold mt-3 hover:text-[#7A8ED7] duration-500 '>Buakaw1</p>
                            </div>

                            <div className='flex flex-col justify-center items-center ml-5 cursor-pointer'>
                                <div className=' flex  items-end hover:scale-105 duration-500 shadow-lg shadow-black/20 dark:shadow-black/40'>
                                    <img src={"/pic/whale_gate.png"} className='w-[197px] h-[232px] border-[#D9D9D9] border-[0.5px] rounded-2xl  '></img>
                                    <div className='w-[197px] h-[69px] bg-[#D9D9D9]/[0.8] rounded-b-2xl absolute flex flex-row justify-center items-center'>
                                        <img src={"/pic/klaytn.png"} className='mr-2'></img>
                                        <p className='text-[#100072] text-[20px]  '>600 Items</p>
                                    </div>
                                </div>
                                <p className='text-white text-2xl font-bold mt-3  hover:text-[#7A8ED7] duration-500 '>Whale Gate Collection</p>
                            </div>
                        </div>
                    </div>
                    <div className='w-2/6 h-full flex flex-col items-end  '>
                        {/* <Conectwalet></Conectwalet> */}
                        <div className=' mt-[30%]'></div>
                        <div className=' mt-[70%]'>
                            <WhiteBox
                                title={'Choose your collection'}
                                detail={'Create new integration, modify existing draft or manage collection which already in production.'}
                                height={174} 
                                width={266} 
                                titleSize={20} 
                                detailSize={15}>
                            </WhiteBox>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home