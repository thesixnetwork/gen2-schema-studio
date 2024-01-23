import React from 'react'

interface WhiteBoxProps {
    Title: string;
    DeTail: string;
    Height : number;
    Width : number;
    TitleSize : number ;
    DetailSize: number ;
}

export default function WhiteBox(props: WhiteBoxProps) {
    return (
        <div className={`w-[${props.Width}px] h-[${props.Height}px]  border-[1px] border-white rounded-xl mt-[20px] flex flex-col items-center p-[15px] `}>
            <p className={`text-[${props.TitleSize}px] font-bold text-white text-center`}>{props.Title}</p>
            <p className={`text-[${props.DetailSize}px] font-light text-white pt-[15px]`} >{props.DeTail}</p>
            {/* &emsp; */}
        </div>
    )
}