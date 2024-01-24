"use server";
import ENV from "@/utils/ENV";
import axios from "axios";
import { cookies } from 'next/headers'

const postCreateAction6 = async (
  schema_code: string,
  actionName: string,
  description: string,
  when: string,
  then: Array<string>,
) => {


  const cookieStore = cookies()
  const token = cookieStore.get('token')
  const apiUrl = `${ENV.API_URL}schema/set_actions`;
  const requestData = {
    payload: {
        schema_code: schema_code,
        update_then: false,
        name: actionName,
        desc: description,
        disable: false,
        when: when,
        then: then,
        allowed_actioner: "ALLOWED_ACTIONER_ALL",
        params: [], 
      },
  };
  try {
    const req = await axios.post(apiUrl, requestData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token?.value,
      },
    });
    const res = req.data;
    if (res.statusCode === "V:0001") {
        // console.log(JSON.stringify(res.data, null, 2))
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};



export default postCreateAction6;