import React from 'react'
import close_detail_icon from '../../public/pic/Union_Icon.png'
import Image from 'next/image'
type Props = {
    isSideBarShow : boolean ;
}

function CloseDetailButton(props: Props) {
    return (
        <div className={` w-9 h-11 bg-Act6  ${props.isSideBarShow ? "rounded-r-lg" : "rounded-l-lg"}  flex justify-center items-center hover:scale-110 duration-500 cursor-pointer`}>
            <Image className={`${props.isSideBarShow ? "rotate-0" : " rotate-180"} w-4 duration-500 `} src={close_detail_icon} alt={''} ></Image>
        </div>
    )
}

export default CloseDetailButton