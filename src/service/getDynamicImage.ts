"use server"

import { cookies } from 'next/headers'
import ENV from '@/utils/ENV'
import axios from 'axios'


export const getDynamicImage = async (schemaCode:string) => {
    const cookieStore = cookies()
    const token = cookieStore.get('token')
    const apiUrl = `${ENV.API_URL}schema/get_image_url/${schemaCode}`;
    const params = {};
    try{
        const req = await axios.get(apiUrl, {
            headers: {
                "Content-Type": "application/json",
                Authorization: token?.value,
            },
        });

        const dynamicImagePath = req.data.data.image_url
        console.log(dynamicImagePath)
        return dynamicImagePath
    }catch(error){
        return error;
    }

  };