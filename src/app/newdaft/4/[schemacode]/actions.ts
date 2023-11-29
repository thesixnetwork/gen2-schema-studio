'use server'
import ENV from '@/utils/ENV'
import axios from 'axios'
import { ISchemaInfo } from '@/type/Nftmngr'

export async function getDaft(schemaCode: string) {
    //   console.log(ENV.API_URL);
    const apiUrl = `${ENV.API_URL}/schema/get_schema_info/${schemaCode}`;

    try {
        const req = await axios.get(apiUrl, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjEyMTIzMTIxMjEifQ.eyJzdWIiOiI2NTA5MzcyYmM3Zjg2YmE0ZmE0MjgxMzciLCJpYXQiOjE3MDEyNDEyMTcsImV4cCI6MTcwMTI0MzAxNywidXNlciI6eyJfaWQiOiI2NTA5MzcyYmM3Zjg2YmE0ZmE0MjgxMzciLCJjaGFubmVsIjoiS2VwbHkiLCJzc29JRCI6IjZ4MXBwajAzM2Q1OXN1ejY0bHR1ZWg1MmQydXN0eXR3M3Q2dzJmcWFzIiwic2lnbmF0dXJlIjoiTUNwMWtzdCs2cXZ1MnVjanNFV2dPOHh3QlI1YnZ5aElPY25ad0J0MUY0WkRDK1k1STBtNWoxeFdNdVp6cXZFOGdZbyt1S29FcUdyZDFISzZOQTRuNXc9PSIsIm1lc3NhZ2UiOiJNeSBNZXNzYWdlIn0sInVzZXJTU08iOlt7Il9pZCI6IjY1MDkzNzJiYzdmODZiYTRmYTQyODEzOCIsInVzZXJJRCI6IjY1MDkzNzJiYzdmODZiYTRmYTQyODEzNyIsInNzb1R5cGUiOiJLZXBseSIsInNzb0lEIjoiNngxcHBqMDMzZDU5c3V6NjRsdHVlaDUyZDJ1c3R5dHczdDZ3MmZxYXMifV19.GszdteXSd58FE_FiHJSOATP-_C-tv1y2I3mKBW9qvq3I6VmvdLqgV_bl4QN1vS0iu4igyenkfW2sHOxmO9gsw6OUWTHoVbyKqvvvY0f7y2UojPZiPm4iB2amRC1qt7WroHhyZsyYBovqIVMQHiUlt8o3j7TReVJCX0RDsaMYCqL5NFoZsIgJL8dbE0Pw8fYRBsZNza0n3CHm7cmPW-PF4AMXFLMPQk0MQmZzJMU7QRX62tEuwOBxK9Uzkcbz-lORusdSdjeH8mWUOjaqyqMrF19SO78s1juo3ofa80BwqjsGgLYzrCe1T-hofwsPoa59Ihmtkjf-sF5B3ttfqtkkpw`, // Set the content type to JSON
            },
        });
        const schema_info:ISchemaInfo = req.data.data.schema_info
        // console.log("req : ", req.data.data.schema_info)
        return schema_info
    } catch (error) {
        console.log("error ", error)
        return null;
    }

}