"use server";
import ENV from "@/utils/ENV";
import api from "@/utils/custiomAxios";
import { ISchemaInfo } from "@/type/Nftmngr";
import axios from "axios";

const getDataTestnet = async () => {
  const apiUrl = `/schema/list_testnet`;

  try {
    const response = await api.get(apiUrl);

    if (response.data.data.result) {
      const arr_schema_name: string[] = [];
      const countColl: string[] = [];
      await response.data.data.result.forEach((res: ISchemaInfo) => {
        if (res.schema_name) {
          arr_schema_name.push(res.schema_name);
        }
      });

      await arr_schema_name.forEach(async (schema_name: string) => {
        try {
          const apiUrl = `${ENV.API_FIVENET}thesixnetwork/sixnft/nftmngr/nft_collection/${schema_name}`;
          const params = {};
          const headers = {
            "Content-Type": "application/json",
          };

          const resColl = await axios.get(apiUrl, {
            params: params,
            headers: headers,
          });
          countColl.push(resColl.data.pagination.total);
        //   console.log("majar", resColl)
        } catch (error) {
          console.error("Error:", error);
        }
      });
    //   console.log("log juff", countColl);
      return response.data;
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

export default getDataTestnet;
