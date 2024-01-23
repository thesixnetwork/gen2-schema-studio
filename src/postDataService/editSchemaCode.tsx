'use server'
import React from 'react'
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import ENV from '@/utils/ENV';
import { DefaultSession } from "@/type/DefaultSession";



export async function editSchemaCode(schemaCode: string,newSchemaCode: string, collectionName: string, description: string,) {
    const apiUrl = `${ENV.API_URL}/schema/set_schema_info`;
    const sesstion:DefaultSession | null = await getServerSession(authOptions);
    const requestData = {
        "payload": {
            "schema_info": {
                "name": `${collectionName}`,
                "description": `${description}`,
                "owner": `${sesstion?.user?.address}`,
                "code": `${newSchemaCode}`,
            },
            "schema_code": `${schemaCode}`,
            "status": "Draft",
            "current_state": "1"
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
        console.log(req.data.data)
        // const schema_info:ISchemaInfo = req.data.data.schema_info
        return req.data
    } catch (error) {
        console.log("error ", error)
        return null;
    }
}