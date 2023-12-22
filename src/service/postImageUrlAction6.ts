"use server";
import ENV from "@/utils/ENV";
import axios from "axios";
import { cookies } from "next/headers";

const postImageUrlAction6 = async (
  schemaCode: string,
  imgSource: string,
  prefix: string,
  postfix: string,
  imgFormat: string
) => {
  console.log(postfix)
  console.log(prefix)
  console.log(imgFormat)
  console.log(imgSource)
  console.log(schemaCode)
  const apiUrl = `${ENV.API_URL}schema/set_image_url`;
  const cookieStore = cookies();
  const token = cookieStore.get("token");
  const requestData = {
    schema_code: schemaCode,
    path: imgSource,
    postfix: postfix,
    prefix: prefix,
    format: imgFormat.replace(".", ""),
    dynamic: "true",
    isEdit: "true"
  };

  try {
    console.log("posting...")
    const req = await axios.post(apiUrl, requestData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token?.value,
      },
    });
    const res = req.data;
    console.log(">",res)
    if (res.statusCode === "V:0001") {
      console.log(JSON.stringify(res.data, null, 2));
      return true;
    } else {
      console.log(res)
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default postImageUrlAction6;
