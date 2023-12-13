'use server'
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export const testFunc = async () => {
    console.log("----------- HELLO ------")
   const s = await getServerSession(authOptions);
   console.log("Test ===>",s)
};
