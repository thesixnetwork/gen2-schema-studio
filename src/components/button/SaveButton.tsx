import React from 'react'

type Props = {}

function SaveButton({ }: Props) {
    return (
        <div className=" rounded-md w-[10.3rem] h-[3.1rem] flex justify-center  items-center drop-shadow-lg group cursor-pointer group-hover:scale-110">
            <div className=" bg-Act6 duration-300 rounded-md w-[10rem] h-[2.8rem] flex justify-center items-center   group-hover:bg-Act7 border-Act6 border">
                <div className="flex items-center  justify-center w-[80%]">
                    <p className="duration-300 text-white text-xl">Save</p>
                </div>
            </div>
        </div>
    )
}

export default SaveButton