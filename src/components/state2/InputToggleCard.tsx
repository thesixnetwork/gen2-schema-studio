import React from 'react'

type Props = {
    title: string;
    require: boolean;
    chainIndex: number;
    onChangeChainIndex: (value: number) => void; // Add onChange prop
}

function InputToggleCard(props: Props) {
    return (
        <div className='w-[50rem] h-36 flex justify-between items-center px-20 border border-2nd4 rounded-2xl bg-white relative'>
            <p className='text-main2 text-2xl font-bold'>{props.title}</p>
            <div className=' w-60 h-10 flex  items-center    '>
                <div onClick={()=>{props.onChangeChainIndex(0)}} className={`w-[50%] h-full border border-Act6 rounded-l-md hover:bg-Act7 hover:text-white hover:border-Act7 cursor-pointer flex justify-center items-center text-xl duration-300 ${props.chainIndex===0 ?"text-white bg-Act6" : " text-Act6 bg-white "}`}>Testnet </div>
                <div onClick={()=>{props.onChangeChainIndex(1)}} className={`w-[50%] h-full border border-Act6 rounded-r-md hover:bg-Act7 hover:text-white hover:border-Act7 cursor-pointer flex justify-center items-center text-xl duration-300 ${props.chainIndex===1 ?"text-white bg-Act6" : " text-Act6 bg-white "}`}>Mainnet </div>
            </div>
            <div className={`w-5 h-5 rounded-full border border-main2 absolute right-2 top-2 ${props.require && 'bg-main2'}`}></div>
        </div>
    )
}

export default InputToggleCard