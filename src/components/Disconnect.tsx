import React from 'react'
import logout from '../../public/pic/Logout.png'
import Image from "next/image";
import { useRouter } from 'next/navigation'
import { useSession, signIn, signOut } from "next-auth/react"

type Props = {}

function Disconnect({ }: Props) {
    const router = useRouter()
    const disconnect = async() => {
        await signOut({
            redirect: false,
          });
        localStorage.clear();
        router.push('/', { scroll: false })
    }

    return (
        <div onClick={disconnect} className=' flex items-center justify-between w-[41%] hover:scale-110 cursor-pointer duration-500'>
            <Image src={logout} alt={''} width={25} height={25}></Image>
            <p>Disconnect</p>
        </div>
    )
}

export default Disconnect