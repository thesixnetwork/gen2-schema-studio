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
    //   console.log(schemaCode);
    // const ss  = await getSession({event:"session"})
    // const user: any = request.nextauth.token;
    const apiUrl = `schema/get_schema_info/${schemaCode}`;
    // const cookieStore = cookies()
    // const token = cookieStore.get('next-auth.session-token')
    // console.log("qqqqdata" ,token?.value)
    //   console.log(apiUrl);


    try {
        const req = await api.get(apiUrl);
        const schema_info:ISchemaInfo = req.data.data.schema_info
        console.log("log here",schema_info.current_state)
        return schema_info
    } catch (error) {
        // console.log("error ", error)
        return null;
    }
}