'use server'
import ENV from '@/utils/ENV'
import axios from 'axios'
import { ISchemaInfo } from '@/type/Nftmngr'

export async function getSchemaInfo(schemaCode: string) {
    //   console.log(ENV.API_URL);
    const apiUrl = `${ENV.API_URL}/schema/get_schema_info/${schemaCode}`;

    try {
        const req = await axios.get(apiUrl, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjEyMTIzMTIxMjEifQ.eyJzdWIiOiI2NTA5MzcyYmM3Zjg2YmE0ZmE0MjgxMzciLCJpYXQiOjE3MDE4NTIyMzUsImV4cCI6MTcwMTg1NDAzNSwidXNlciI6eyJfaWQiOiI2NTA5MzcyYmM3Zjg2YmE0ZmE0MjgxMzciLCJjaGFubmVsIjoiS2VwbHkiLCJzc29JRCI6IjZ4MXBwajAzM2Q1OXN1ejY0bHR1ZWg1MmQydXN0eXR3M3Q2dzJmcWFzIiwic2lnbmF0dXJlIjoiTUNwMWtzdCs2cXZ1MnVjanNFV2dPOHh3QlI1YnZ5aElPY25ad0J0MUY0WkRDK1k1STBtNWoxeFdNdVp6cXZFOGdZbyt1S29FcUdyZDFISzZOQTRuNXc9PSIsIm1lc3NhZ2UiOiJNeSBNZXNzYWdlIn0sInVzZXJTU08iOlt7Il9pZCI6IjY1MDkzNzJiYzdmODZiYTRmYTQyODEzOCIsInVzZXJJRCI6IjY1MDkzNzJiYzdmODZiYTRmYTQyODEzNyIsInNzb1R5cGUiOiJLZXBseSIsInNzb0lEIjoiNngxcHBqMDMzZDU5c3V6NjRsdHVlaDUyZDJ1c3R5dHczdDZ3MmZxYXMifV19.gLRhCwzK6MZWYnjhROHXXzm9dWze7yFH5nNvMb_XML3WO97LuLnvWV4Sxp46Y4vZfxkm2yWCTC5RDcAyk1p6gzwQpyjSkHZgfqZNNdSm8wuxlBexnerxfcTMduPna7wBRNqoip_HoL2kVZBuvLJh_uJkH0Tf8lX-GSwYDoBSc68knT6GYA7aZ3x0Eip8x-8n7NPzUn5dYzxOByi4JeSnd4Rj4GsbZrFnFwuh5LZ-MjtoHei7-GzMM6J3qmLnyfAlpCjKGqjHghtrUxwDKQ-SKuSi15pPJ-oYDaqxygz-l1qWQsFA4TRKy3DeR9vQRioPWFvVYRsxmqNe-FxmcWs0wQ`, // Set the content type to JSON
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