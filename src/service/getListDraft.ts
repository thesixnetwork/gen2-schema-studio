"use server"
import { cookies } from 'next/headers'
import ENV from '@/utils/ENV'
import axios from 'axios'

export const getListDraft = async () => {
    const cookieStore = cookies()
    const token = cookieStore.get('token')
    const apiUrl = `${ENV.API_URL}schema/list_draft`; // Replace with your API endpoint
    const params = {};
    const headers = {
        'Content-Type': 'application/json',
        Authorization: token?.value,
    }

    try {
        const req = await axios.get(apiUrl,{
            params: params, // Pass parameters as an object
            headers: headers, // Pass headers as an object
        });

        console.log(req.data.data.sesstion)
        return req.data.data.sesstion
    } catch (error) {
        return error;
    }

};