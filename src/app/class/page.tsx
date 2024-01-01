import BackPageButton from '@/components/BackPageButton'
import NextPageButton from '@/components/NextPageButton'
import React from 'react'

type Props = {}

function page({ }: Props) {
    const classDetail = [
        { title: "Beginner", description: "At the beginner level, users have little to no programming experience. They are eager to learn and understand the basics of programming. The user interface will be designed to provide simple navigation,clear instructions, and visual aids to support their learning process." },
        { title: "Intermediate", description: "At the intermediate level, users have some programming experience and understanding of core concepts. The user interface will provide advanced features and resources to support their continued growth and development" },
        { title: "Developer", description: "For developers, the user interface will offer advanced tools and features that cater to their extensive programming experience and expertise." },
    ]

    return (
        <div className=" w-full h-full min-h-[75vh] p-10 flex flex-col justify-between items-center ">
            {classDetail.map((item: any) => (
                <div className=' w-[80%] h-44 px-[6%]  rounded-2xl border border-2nd4 flex flex-col justify-center items-center'>
                    <h1 className=' text-main2 text-3xl'>{item.title}</h1>
                    <p className=' text-main2 mt-5 text-lg'>{item.description}</p>
                </div>
            ))
            }
            <div className=' w-[90%] h-20 flex justify-between items-center'>
                <BackPageButton></BackPageButton>
                <NextPageButton></NextPageButton>
            </div>
        </div>
    )
}

export default page