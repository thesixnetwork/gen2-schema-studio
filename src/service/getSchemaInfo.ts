'use server'
import ENV from '@/utils/ENV'
import axios from 'axios'
import { ISchemaInfo } from '@/type/Nftmngr'
import { getAccessTokenFromLocalStorage } from '@/helpers/AuthService';

export async function getSchemaInfo(schemaCode: string,AccessToken : string) {
    //   console.log(ENV.API_URL);
    const apiUrl = `${ENV.API_URL}/schema/get_schema_info/${schemaCode}`;

    try {
        const req = await axios.get(apiUrl, {
            headers: {
                "Content-Type": "application/json",
                Authorization: AccessToken, // Set the content type to JSON
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