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
  CHAINID: process.env.NEXT_PUBLIC_CHAIN_NAME  || "fivenet",
  API_URL: process.env.API_ENDPOINT_SCHEMA_INFO_2 || "https://six-gen2-studio-nest-backend-api-traffic-gateway-1w6bfx2j.ts.gateway.dev/",
  Client_API_URL: process.env.NEXT_PUBLIC__API_ENDPOINT_SCHEMA_INFO || "https://six-gen2-studio-nest-backend-api-traffic-gateway-1w6bfx2j.ts.gateway.dev/",
  API_FIVENET: process.env.NEXT_PUBLIC__API_ENDPOINT_SIX_FIVENET || "https://api1.fivenet.sixprotocol.net/",
  RPC_FIVENET2: process.env.NEXT_PUBLIC__RPC2_ENDPOINT_SIX_FIVENET || "https://rpc2.fivenet.sixprotocol.net:443",
  SIGN_MESSAGE: process.env.NEXT_PUBLIC__SIGN_MESSAGE || "My Message",
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "3lVCslvPDrIe4Coab77UTh1e/FmdSDL1RYNneEKF2Yk=",
  SIXSCAN_FIVENET: process.env.NEXT_PUBLIC__SIXSCAN_FIVENET || "https://v2.fivenet.sixscan.io/",
  NEXT_APP_OPENAI_API_KEY: process.env.NEXT_APP_OPENAI_API_KEY || "",
//   RPC_URL: process.env.RPC_URL || "https://rpc2.fivenet.sixprotocol.net",
};

// console.log("api : ", process.env.API_ENDPOINT_SCHEMA_INFO_2 )

export default ENV;
