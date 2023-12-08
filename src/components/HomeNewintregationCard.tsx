'use client';
import React from 'react'
import Image from 'next/image'
import Plus_Icon from '../../public/pic/Plus_Icon.png'
type Props = {}

function HomeNewintregationCard({ }: Props) {
    return (
        <div className=' w-draftCardWidth h-draftCardHeight border border-dashed rounded-2xl border-Act8 flex flex-col justify-center items-center hover:scale-105 duration-500 cursor-pointer '>
            <div className=' w-10'>
                <Image src={Plus_Icon} alt={''}></Image>
            </div>
            <p className=' text-Act6'>New Integration</p>
        </div>
    )
}

export default HomeNewintregationCard