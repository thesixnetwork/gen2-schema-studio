'use server'
import ENV from '@/utils/ENV'
import axios from 'axios'
import { ISchemaInfo } from '@/type/Nftmngr'
import { getAccessTokenFromLocalStorage } from '@/helpers/AuthService';
import { cookies } from 'next/headers'
import { useSession, signIn, signOut , getSession} from "next-auth/react"
import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import api  from "@/utils/custiomAxios";
// import { getServerSession } from "next-auth"
// import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next"

export async function getSchemaInfo(schemaCode: string) {
    //   console.log(ENV.API_URL);
    // const ss  = await getSession({event:"session"})
    // const user: any = request.nextauth.token;
    const apiUrl = `/schema/get_schema_info/${schemaCode}`;
    const cookieStore = cookies()
    const token = cookieStore.get('next-auth.session-token')
    console.log("qqqqdata" ,token?.value)

    try {
        const req = await api.get(apiUrl);
        const schema_info:ISchemaInfo = req.data.data.schema_info
        // console.log("222222")

        // console.log(req)
        // console.log(req.data)
        // console.log("req : ", req.data.data.schema_info)
        return schema_info
    } catch (error) {
        // console.log("error ", error)
        return null;
    }
}