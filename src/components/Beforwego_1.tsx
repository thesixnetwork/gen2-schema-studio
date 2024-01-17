import React from 'react'
import logo1 from "../../public/pic/Vector 4.png"
import Image from 'next/image'
import NextPageButton from './NextPageButton'
import WhiteBox from './WhiteBoxDetail'
import { useRouter } from 'next/navigation'
interface MyComponentProps {

}

function Beforwego_1(props: MyComponentProps) {
    const router = useRouter();
    return (
        <div className=' fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-80  backdrop-blur-sm flex justify-center items-center '>
            <div className=' absolute top-[20vh] left-[15vw]'>
                <p className=' font-bold text-5xl'>Before we go</p>
            </div>
            <div className=' absolute left-[10vw]'>
                <WhiteBox
                    Title={'This is information'}
                    DeTail={'This is the content of the information'}
                    Height={136} Width={230} TitleSize={20} DetailSize={15}>
                </WhiteBox>

                <div >
                    <Image src={logo1} className='mt-[-10px] '></Image>
                    <p className=' ml-28'>This is info box</p>
                </div>

            </div>

            <div className='absolute  bottom-[20vh] left-[40vw]'>
                <div onClick={() => { router.push(`/newdraft/1/newintegration`, { scroll: false }) }}>

                    <NextPageButton></NextPageButton>
                </div>
                <div className=' flex justify-between items-center'>
                    <Image src={logo1} className=' ml-14 -rotate-[75deg] '></Image>
                    <p className=' ml-20 w-40 '>This is button</p>
                </div>
            </div>

            <div className='w-[658px] h-[121px] border-[1px] border-white rounded-xl p-2 flex  items-center justify-center  absolute top-[25vh] right-[25vw]  '>
                <p className='font-bold text-[24px] mr-10'>Field Title / Label</p>
                <input type="text" placeholder="textfield input" className='bg-transparent text-[24px] border-[1px] border-[#D9D9D9DD] border-dashed p-1 z-50 focus:outline-none focus:scale-105 duration-1000  '></input>
                <div className='w-[15px] h-[15px] bg-[#D9D9D9] rounded-full absolute ml-[630px] mb-[90px]'></div>
                <div className='mt-[20%] ml-[-200px] absolute z-50'>

                </div>





                <div className='absolute mt-[120px] ml-[500px]'>
                    <Image src={logo1} className='mt-[80px] mr-[150px] -rotate-45'></Image>
                    <p className='ml-[150px] w-40 mt-[-50px] absolute'>This is input</p>
                </div>


                <div className='absolute mt-[-400px]'>
                    <Image src={logo1} className='mt-[155px] ml-[540px] rotate-[140deg] z-[-10]'></Image>
                    <div className='ml-[400px] mt-[-170px] absolute grid grid-cols-2 gap-x-0  justify-center items-center'>
                        <div className='w-[15px] h-[15px] bg-[#D9D9D9] rounded-full '></div>
                        <p className='ml-[-20px]'>Required</p>
                        <div className='w-[15px] h-[15px] bg-transparent border border-[#D9D9D9]  rounded-full'></div>
                        <p className='ml-[-20px]'>Optional</p>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Beforwego_1