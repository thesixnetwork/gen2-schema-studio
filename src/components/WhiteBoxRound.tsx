import React from 'react'

interface MyComponentProps {
    Title: string;
    DeTail: string;
    Height: number;
    Widgth:number;
}

export default function WhiteBoxRound(props: MyComponentProps) {
    return (
        <div className={` w-3/4 p-[30px] h-[${props.Height}px] border rounded-full flex flex-col justify-center items-center mb-5 cursor-pointer hover:scale-105 duration-500`}>
            <h1 className='font-bold text-2xl text-white '>{props.Title}</h1>
            <p className=' text-sm text-white'>&emsp;{props.DeTail}</p>
        </div>
    )
}