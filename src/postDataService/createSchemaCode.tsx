'use server'
import React from 'react'
import api from "@/utils/custiomAxios";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ENV from '@/utils/ENV';


export async function createSchemaCode(schemaCode: string,collectionName:string,description:string,) {
    const apiUrl = `${ENV.API_URL}/schema/create_schema_info`;
    const sesstion = await getServerSession(authOptions);
    const requestData = {
        "schema_name": `${schemaCode}`,
        "status": "Draft",
        "current_state": "1",
        "description": `${description}`,
        "collection_name": `${collectionName}`,
    };
    try {
        const req = await axios.post(apiUrl,requestData,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${sesstion.user.accessToken}`  // Set the content type to JSON
                // Add any other headers your API requires
            }},);
        console.log(req.data.data)
        // const schema_info:ISchemaInfo = req.data.data.schema_info
        return req.data
    } catch (error) {
        console.log("error ", error)
        return null;
    }
}