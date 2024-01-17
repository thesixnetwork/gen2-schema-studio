"use server";
import ENV from "@/utils/ENV";
import axios from "axios";
import { cookies } from 'next/headers'

const postAction7 = async (
  schema_code: string,
  status: string
) => {
    console.log("posting...")
  const cookieStore = cookies()
  const token = cookieStore.get('token')
  console.log(token)
  console.log(schema_code)
  const apiUrl = `${ENV.API_URL}schema/set_actions`;
  const requestData = {
    payload: {
        schema_code: schema_code,
        status: status,
        current_state: "7"
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
        console.log(JSON.stringify(res.data, null, 2))
      return true;
    } else {
        console.log(res)
      return false;
    }
  } catch (error) {
  console.log(error)
    return false;
  }
};



export default postAction7;