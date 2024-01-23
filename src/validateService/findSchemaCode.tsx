'use server'
import React from 'react'
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import ENV from '@/utils/ENV';
import { DefaultSession } from "@/type/DefaultSession";



export async function findSchemaCode(schemaCode: string) {
    const apiUrl = `${ENV.API_URL}/schema/validate_schema_code`;
    const sesstion:DefaultSession | null = await getServerSession(authOptions);
    const params = {
        schema_code: `${schemaCode}`,
    };
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sesstion?.user?.accessToken}`,
    }

    // Make a GET request with parameters
    const res =  await axios.get(apiUrl, {
        params: params, // Pass parameters as an object
        headers: headers, // Pass headers as an object
    })
        .then((response) => {
            // console.log("response :",response.data.data.status);
            return response.data.data.status
        })
        .catch((error) => {
            console.error('Error:', error);
            return null
        });

    return res
       
}