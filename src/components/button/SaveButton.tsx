import React from 'react'

type Props = {}

function SaveButton({ }: Props) {
    return (
        <div className=" rounded-md w-[10.3rem] h-[3.1rem] flex justify-center  items-center drop-shadow-lg group cursor-pointer group-hover:scale-110">
            <div className=" bg-Act7 bg-opacity-20 duration-300 rounded-md w-[10rem] h-[2.8rem] flex justify-center items-center   group-hover:bg-Act6 border-Act6 border">
                <div className="flex items-center  justify-center w-[80%]">
                    <p className="group-hover:text-white duration-300 text-Act6 text-xl">Save</p>
                </div>
            </div>
        </div>
    )
}

export default SaveButton