'use server'
import ENV from '@/utils/ENV'
import axios from 'axios'


export async function reToken(AccessToken : string) {
    const apiUrl = `${ENV.API_URL}/auth/refreshToken`;
    const requestData = {
        refresh_token: AccessToken,
    }

    try {
        const req = await axios.post(apiUrl, requestData, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjEyMTIzMTIxMjEifQ.eyJzdWIiOiI2NTA5MzcyYmM3Zjg2YmE0ZmE0MjgxMzciLCJpYXQiOjE3MDE4NTEwOTksImV4cCI6MTcwMTg1Mjg5OSwidXNlciI6eyJfaWQiOiI2NTA5MzcyYmM3Zjg2YmE0ZmE0MjgxMzciLCJjaGFubmVsIjoiS2VwbHkiLCJzc29JRCI6IjZ4MXBwajAzM2Q1OXN1ejY0bHR1ZWg1MmQydXN0eXR3M3Q2dzJmcWFzIiwic2lnbmF0dXJlIjoiTUNwMWtzdCs2cXZ1MnVjanNFV2dPOHh3QlI1YnZ5aElPY25ad0J0MUY0WkRDK1k1STBtNWoxeFdNdVp6cXZFOGdZbyt1S29FcUdyZDFISzZOQTRuNXc9PSIsIm1lc3NhZ2UiOiJNeSBNZXNzYWdlIn0sInVzZXJTU08iOlt7Il9pZCI6IjY1MDkzNzJiYzdmODZiYTRmYTQyODEzOCIsInVzZXJJRCI6IjY1MDkzNzJiYzdmODZiYTRmYTQyODEzNyIsInNzb1R5cGUiOiJLZXBseSIsInNzb0lEIjoiNngxcHBqMDMzZDU5c3V6NjRsdHVlaDUyZDJ1c3R5dHczdDZ3MmZxYXMifV19.YkDHFcdqBqvXfgdRZAF-_Rb-ggYJUYwXNhge-qb6qMWgMsBgedgBS8kHDieoArXZf4Iiour4W-sWkuukRbnbAYY8xh5jGgbq4kImN9DKqWFG8qzZ8GEqcxgQ65d_oBkkR5zOsCLNDrPtx5SURbkQY-_jHOQSr0Ncc8mgegjZpFsPSN3mdrw6KnyMscj559MHKKSyS4ApoCHIOUPQuvpUPqh6RynwX6XVziSFLVYN6SH44Lt6IGFqEdfbouV7NNbcfBUJv-NCyqlls-TWeltloND1lQVBbf5kjHILu73ErATcFkwbdgAR58LPY5H73XZbPZHSaONvemaAhJXQrSZKOw`, // Set the content type to JSON
            },
          });
        const token = req.data.data.access_token
        // console.log("req : ", req.data.data.schema_info)
        return token
    } catch (error) {
        // console.log("error ", error)
        return null;
    }
}