import dotenv from "dotenv";
dotenv.config();

// let dufaultScanUrl

// let lower_chainName = process.env.NEXT_PUBLIC_CHAIN_NAME?.toLowerCase()

// if (lower_chainName === "mainnet" || lower_chainName === "sixnet") {
//   dufaultScanUrl = "https://evm.sixscan.io"
// }else{
//   dufaultScanUrl = "https://fivenet.evm.sixscan.io"
// }

const ENV = {
  API_URL: process.env.API_ENDPOINT_SCHEMA_INFO_2 || "",
  Client_API_URL: process.env.NEXT_PUBLIC__API_ENDPOINT_SCHEMA_INFO || "",
//   RPC_URL: process.env.RPC_URL || "https://rpc2.fivenet.sixprotocol.net",
};

// console.log("api : ", process.env.API_ENDPOINT_SCHEMA_INFO_2 )

export default ENV;
