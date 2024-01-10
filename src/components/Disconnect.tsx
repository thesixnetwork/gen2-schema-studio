import React, { useState } from 'react'
import logout from '../../public/pic/Logout.png'
import Image from "next/image";
import { useRouter } from 'next/navigation'
import { useSession, signIn, signOut } from "next-auth/react"
import ConfirmModalChakra from './ConfirmModalChakra';

type Props = {}

function Disconnect({ }: Props) {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const disconnect = async () => {
        await signOut({
            redirect: false,
        });
        localStorage.clear();
        router.push('/', { scroll: false })
    }

    return (
        <div>
            <div onClick={() => { setIsOpen(true) }} className=' flex items-center justify-between w-[41%] hover:scale-110 cursor-pointer duration-500'>
                <Image src={logout} alt={''} width={25} height={25}></Image>
                <p>Disconnect</p>
            </div>
            <ConfirmModalChakra title={'Are you sure to disconnect ?'} confirmButtonTitle={'Disconnect'} function={disconnect} isOpen={isOpen} setIsOpen={setIsOpen}
            ></ConfirmModalChakra>
        </div>
    )
}

export default Disconnect