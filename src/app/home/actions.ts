'use server'
import ENV from '@/utils/ENV'
import axios from 'axios'
import { getAccessTokenFromLocalStorage } from '@/helpers/AuthService';

export async function getListDraft( ) {
    const apiUrl = `${process.env.NEXT_PUBLIC__API_ENDPOINT_SCHEMA_INFO}schema/list_draft`;
    const params = {};
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAccessTokenFromLocalStorage()}`,
    };

    try {
        const response = await axios.get(apiUrl, {
            params: params,
            headers: headers,
        }); 
        console.log(response.data) ;
        return response.data.data.sesstion ;

    } catch (error) {
        console.error("Error:", error);
        return null
    }
}