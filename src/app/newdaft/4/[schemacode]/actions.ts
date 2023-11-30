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
                Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjEyMTIzMTIxMjEifQ.eyJzdWIiOiI2NTA5MzcyYmM3Zjg2YmE0ZmE0MjgxMzciLCJpYXQiOjE3MDEzMjM5MTAsImV4cCI6MTcwMTMyNTcxMCwidXNlciI6eyJfaWQiOiI2NTA5MzcyYmM3Zjg2YmE0ZmE0MjgxMzciLCJjaGFubmVsIjoiS2VwbHkiLCJzc29JRCI6IjZ4MXBwajAzM2Q1OXN1ejY0bHR1ZWg1MmQydXN0eXR3M3Q2dzJmcWFzIiwic2lnbmF0dXJlIjoiTUNwMWtzdCs2cXZ1MnVjanNFV2dPOHh3QlI1YnZ5aElPY25ad0J0MUY0WkRDK1k1STBtNWoxeFdNdVp6cXZFOGdZbyt1S29FcUdyZDFISzZOQTRuNXc9PSIsIm1lc3NhZ2UiOiJNeSBNZXNzYWdlIn0sInVzZXJTU08iOlt7Il9pZCI6IjY1MDkzNzJiYzdmODZiYTRmYTQyODEzOCIsInVzZXJJRCI6IjY1MDkzNzJiYzdmODZiYTRmYTQyODEzNyIsInNzb1R5cGUiOiJLZXBseSIsInNzb0lEIjoiNngxcHBqMDMzZDU5c3V6NjRsdHVlaDUyZDJ1c3R5dHczdDZ3MmZxYXMifV19.CNZ8K04tVYNRATTL29plYlXVjcTJkBE5TSJ18N5gpdI2HNWn4ZfkdAE7MRP7KSX5yx9J_vN2VT8U0DAB8uKz5_em5CiG1y2uPNXjw8Z-ft0QVJa-PqMhpFUuC_5WT1tBWrKPaio9uqRFcSfy-Ri5hGEDuc9qCCSu85DRZDmhuyb-zGXiDa2gzYkYq8s3mgcprMojiF1mogmM1EDpKHilN7Z1K3bqgE8qLpWc-_denn6mZEjVQlEP8eUec0wQx7OqnOwmzHAKmXicTBTIwKOVpXJKI1tVgl36ic8QEHEPlSI-GuyAN9LuW5O3kRYXx50NklUv4NmvURdJRdoUzwy76w`, // Set the content type to JSON
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