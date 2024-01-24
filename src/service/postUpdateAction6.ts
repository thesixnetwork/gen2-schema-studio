"use server";
import ENV from "@/utils/ENV";
import axios from "axios";
import { cookies } from 'next/headers'

const postUpdateAction6 = async (
  schema_code: string,
  allAction: Array<any>,
) => {

  const cookieStore = cookies()
  const token = cookieStore.get('token')
  const apiUrl = `${ENV.API_URL}schema/set_schema_info`;
  const requestData = {
    payload: {
      schema_info: {
        onchain_data: {
          actions: allAction,
        },
      },
      schema_code: schema_code,
      status: "Draft",
      current_state: "6",
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


export default postUpdateAction6;