import React from 'react'
import deleate_icon from '../../../public/pic/deleate_attribute_card.png'
import Image from 'next/image'
import { title } from 'process';
type Props = {
    name: string;
    dataType: string;
    traitType: string;
}

function AttributeCard(props: Props) {
    const attributeDetail = [
        {
            title: "Name",
            value: `${props.name}`,
        },
        {
            title: "Data type",
            value: `${props.dataType}`,
        },
        {
            title: "Trait type",
            value: `${props.traitType}`,
        }
    ]

    return (
        <div className=' w-draftCardWidth h-draftCardHeight rounded-2xl border border-2nd4 bg-white relative p-4 flex flex-col justify-center items-start  '>
           
            {attributeDetail.map((attributeDetail,index) => (
                <div key={index} className='border-b-2nd4 border-b w-full h-20 pt-3 flex flex-col justify-between '>
                    <p className=' text-main2 text-xl'>{attributeDetail.title}</p>
                    <p className=' text-Act6 text-sm font-bold'>{attributeDetail.value}</p>
                </div>
            ))}
        </div>
    )
}

export default AttributeCard