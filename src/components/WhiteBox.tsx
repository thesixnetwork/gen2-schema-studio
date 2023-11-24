import React from 'react'

interface MyComponentProps {
    title: string;
    detail: string;
    height : number;
    width : number;
    titleSize : number ;
    detailSize : number ;
    children?: React.ReactNode;
}

export default function WhiteBox(props: MyComponentProps) {
    return (
        <div className={`w-[${props.width}px] h-[${props.height}px]  border-[1px] border-white rounded-xl mt-[20px] flex flex-col items-center p-[15px] `}>
            <p className={`text-[${props.titleSize}px] font-bold text-white text-center`}>{props.title}</p>
            <p className={`text-[${props.detailSize}px] font-light text-white pt-[15px]`} >&emsp;{props.detail}</p>
        </div>
    )
}