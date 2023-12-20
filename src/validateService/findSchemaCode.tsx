'use server'
import React from 'react'
import api from "@/utils/custiomAxios";


export async function findSchemaCode(schemaCode: string) {
    const apiUrl = `/schema/validate_schema_code/${schemaCode}`;
    try {
        const req = await api.get(apiUrl);
        console.log(req.data.data)
        // const schema_info:ISchemaInfo = req.data.data.schema_info
        return req.data.data.status
    } catch (error) {
        // console.log("error ", error)
        return null;
    }
}