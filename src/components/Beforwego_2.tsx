import React from 'react'
import menu from '../../public/pic/Stepsmenu.png'
import Image from 'next/image'
import DetailBox from './DetailBox'
import StartPageButton from './StartButton'
import { useRouter } from 'next/navigation'

interface MyComponentProps {
    setParentState1: React.Dispatch<React.SetStateAction<any>>;
    setParentState2: React.Dispatch<React.SetStateAction<any>>;
}

function Beforwego_2(props: MyComponentProps) {
    const router = useRouter();
    return (
        <div onClick={()=>{ props.setParentState2(false)}} className=' fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-80  backdrop-blur-sm flex justify-center items-center '>
            <div className=' flex flex-col justify-center items-center absolute top-[20vh] left-[15vw]'>
                <p className=' text-5xl font-bold'>Creating a schema</p>
                <Image className=' w-[50vw]' src={menu} ></Image>
            </div>
            <div className=' absolute  right-[10vw]' >
                <DetailBox title={'Creating your schema'} description={'Schema describes your dynamic attributes and their actions which business logic can be defined to control how your attributes change.'}></DetailBox>
            </div>

            <div onClick={() => { router.push(`/newdraft/1/newintegration`, { scroll: false }) }} className=' absolute bottom-[30vh]'>
                <StartPageButton></StartPageButton>
            </div>
        </div>
    )
}

export default Beforwego_2