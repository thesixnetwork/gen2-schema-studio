"use server"
import axios from "axios";
import ENV from "../utils/ENV";

// import { Account } from "../types/Auth";


export const getDaft = async (schemaCode: string) => {
  try {
    const res = await axios.get(`${ENV.API_URL}/schema/get_schema_info/${schemaCode}`);
    const daft = res.data;
    // console.log(daft)
    if (!daft) {
      return ;
    }
    return daft;
  } catch (error) {
    // console.error(error);
    return [];
  }
};