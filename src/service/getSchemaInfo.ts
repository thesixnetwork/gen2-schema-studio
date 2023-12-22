'use server'
import ENV from '@/utils/ENV'
import axios from 'axios'
import { ISchemaInfo } from '@/type/Nftmngr'
import { getAccessTokenFromLocalStorage } from '@/helpers/AuthService';
import { cookies } from 'next/headers'
import { useSession, signIn, signOut , getSession, SessionContextValue} from "next-auth/react"

export async function getSchemaInfo(schemaCode: string,AccessToken : string) {
    //   console.log(ENV.API_URL);
    console.log(schemaCode)
    const session  = getSession( "session")
    const apiUrl = `${ENV.API_URL}/schema/get_schema_info/${schemaCode}`;
    const cookieStore = cookies()
    const token = cookieStore.get('token')
    console.log(SessionContextValue)

    try {
        const req = await axios.get(apiUrl, {
            headers: {
                "Content-Type": "application/json",
                Authorization: token?.value, // Set the content type to JSON
            },
        });
        const schema_info:ISchemaInfo = req.data.data.schema_info
        // console.log("req : ", req.data.data.schema_info)
        return schema_info
    } catch (error) {
        // console.log("error ", error)
        return null;
    }
}