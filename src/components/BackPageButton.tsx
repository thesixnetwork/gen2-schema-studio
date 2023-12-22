import React from 'react'

type Props = {}

function BackPageButton({ }: Props) {
    return (
        <div className="bg-white rounded-md w-[10.3rem] h-[3.1rem] flex justify-center items-center drop-shadow-lg group cursor-pointer group-hover:scale-110">
            <div className="bg-white duration-300 rounded-md w-[10rem] h-[2.8rem] flex justify-start items-center p-2  group-hover:bg-Act6 border-Act6 border">
                <div className="flex items-center justify-between w-[80%]">
                    <p className="group-hover:text-white duration-300 text-Act6 text-xl">&lt;</p>
                    <p className="group-hover:text-white duration-300 text-Act6 text-xl">Back</p>
                </div>
            </div>
        </div>
    )
}

export default BackPageButton