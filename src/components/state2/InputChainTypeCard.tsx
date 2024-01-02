import React from 'react'
const chainLogoColorImages = [
    '/pic/chainlogocolor1.png',
    '/pic/chainlogocolor2.svg',
    '/pic/chainlogocolor3.png',
    '/pic/chainlogocolor4.png',
  ];
  const chainLogoDarkImages = [
    '/pic/chainlogodark1.png',
    '/pic/chainlogodark2.png',
    '/pic/chainlogodark3.png',
    '/pic/chainlogodark4.png',
  ];  

import Image from 'next/image'
type Props = {
    title: string;
    require: boolean;
    chainIndex: number;
    onChangeChainIndex: (value: number) => void; // Add onChange prop
}

function InputChainTypeCard(props: Props) {
    const chainType = ["SIX PROTOCOL", "ETHEREUM", "KLAYTN", "BNB"]
    const getChainLogoImage = (index: number) => {
        return props.chainIndex === index ? chainLogoColorImages[index] : chainLogoDarkImages[index];
      };
    return (
        <div className='w-[50rem] h-36 flex justify-between items-center px-20 border border-2nd4 rounded-2xl bg-white relative'>
            <p className='text-main2 text-2xl font-bold'>{props.title}</p>
            <div className=' w-[28rem]  flex justify-between items-center  '>
                {chainType.map((chain, index) => (
                    <div key={index} onClick={()=>{props.onChangeChainIndex(index)}} className=' h-20 flex flex-col justify-between items-center hover:scale-110 cursor-pointer duration-300'>
                        <img  src={getChainLogoImage(index)} alt={''} className={`${(props.chainIndex===1 && index===1) ? " h-12 " : " w-14 " }`} ></img>
                        <p className={`${ props.chainIndex===index ? "text-Act6" : " text-Act1"} duration-300`}>{chain}</p>
                    </div>
                ))}
            </div>

            <div className={`w-5 h-5 rounded-full border border-main2 absolute right-2 top-2 ${props.require && 'bg-main2'}`}></div>
        </div>
    )
}

export default InputChainTypeCard