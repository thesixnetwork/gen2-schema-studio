'use server'
import React from 'react'
import api from "@/utils/custiomAxios";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import ENV from '@/utils/ENV';
import { IOriginAttributes } from "@/type/Nftmngr";
import { DefaultSession } from "@/type/DefaultSession";



export async function saveState3(originAttributes : IOriginAttributes[], schemaCode: string) {
    const apiUrl = `${ENV.API_URL}/schema/set_schema_info`;
    const sesstion: DefaultSession | null = await getServerSession(authOptions);
    const requestData = {
        "payload": {
            "schema_info": {
                "origin_data": {
                    "origin_attributes": originAttributes
                }
            },
            "schema_code": `${schemaCode}`,
            "status": "Draft",
            "current_state": "3"
        }
    };


    try {
        const req = await axios.post(apiUrl, requestData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sesstion?.user?.accessToken}`  // Set the content type to JSON
                // Add any other headers your API requires
            }
        },);
        // console.log(req.data.data)
        // const schema_info:ISchemaInfo = req.data.data.schema_info
        return req.data
    } catch (error) {
        // console.log("error ", error)
        return null;
    }
}