"use server"
import axios from "axios";
import { cookies } from "next/headers";

const getImgUrlAction6 = async (schema_code:string) => {
    const cookieStore = cookies();
    const token = cookieStore.get('token')

    const apiUrl = `${process.env.NEXT_APP_API_ENDPOINT_SCHEMA_INFO}schema/get_image_url/${schema_code}`;
    const params = {};
    const headers = {
      "Content-Type": "application/json",
      Authorization: token?.value,
    };
    try {
      const response = await axios.get(apiUrl, {
        params: params,
        headers: headers,
      });
    //   setImgSource(response.data.data.image_url.path);
    //   setImgFormat("." + response.data.data.image_url.format);
    //   if (response.data.data.image_url.postfix !== null) {
    //     setPostfix(response.data.data.image_url.postfix);
    //   }
      console.log(":: res ::", response);
      return response.data
    } catch (error) {
      console.error("Error:", error);
    //   setCookie("isCreateDyanamicImage", "true");
    return error
    }
    // let tempObj;
    // if (schemacode) {
    //   tempObj = await getDynamicImage(schemacode);
    // }
  };

export default getImgUrlAction6;