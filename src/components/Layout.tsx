"use client";
import { CircularProgress, Box, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { Divider, Center } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import axios from "axios";

import HomeFooter from "@/components/HomeFooter";
import HomeNavBar from "@/components/HomeNavbar";
import HomeSidebar from "@/components/HomeSidebar";
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  saveTokensToLocalStorage,
} from "@/helpers/AuthService";
import CloseDetailButton from "./CloseDetailButton";
import Loading from "./Loading";

import { StargateClient } from "@cosmjs/stargate";
import { useSession, signIn } from "next-auth/react";


export default function Layout({
  children,
}: // modalstate,
{
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const boxRef = useRef<HTMLHRElement>(null);
  const [childrenHeight, setChildrenHeight] = useState(800);

  //--------------------------------------Authen Refresh Token----------------------------------------//
  const [chainId, setChainId] = useState("fivenet");
  const [token, setToken] = useState("usix");
  const [cosmosAddress, setCosmosAddress] = useState("");
  const [rpcEndpoint, setRpcEndpoint] = useState<string>(
    process.env.NEXT_PUBLIC__RPC1_ENDPOINT_SIX_FIVENET || "default-fallback-value"
  );
//   console.log(rpcEndpoint)
  const message = process.env.NEXT_PUBLIC__SIGN_MESSAGE;
  const [exponent, setExponent] = useState(1e6);
  //--------------------------------------Authen Refresh Token----------------------------------------//
  //--------------------------------------Frontend State----------------------------------------//
  const [isSideBarShow, setIsSideBarShow] = useState(true);
  //--------------------------------------Frontend State----------------------------------------//
  useEffect(() => {
    if (boxRef.current) {
      const { height } = boxRef.current.getBoundingClientRect();
      setChildrenHeight(height);
    }
  }, [children]);

  //--------------------------------------Authen Refresh Token----------------------------------------//
//   const [refreshTokenNumber, setRefreshTokenNumber] = useState(0);
//   const RefreshToken = () => {
//     setTimeout(() => {
//       const apiUrl = `${process.env.API_ENDPOINT_SCHEMA_INFO}auth/refreshToken`;
//       const requestData = {
//         refresh_token: `${getRefreshTokenFromLocalStorage()}`,
//       };
//       axios
//         .post(apiUrl, requestData, {
//           headers: {
//             Authorization: `Bearer ${getAccessTokenFromLocalStorage()}`,
//           },
//         })
//         .then((response) => {
//           // console.log('API Response from refresh :', response.data);
//           saveTokensToLocalStorage(
//             response.data.data.access_token,
//             response.data.data.refresh_token
//           );
//           const accessToken = getAccessTokenFromLocalStorage();
//           const refreshToken = getRefreshTokenFromLocalStorage();
//           // console.log("New Access: ", accessToken)
//           // console.log("New Refresh: ", refreshToken)
//           setRefreshTokenNumber(refreshTokenNumber + 1);
//         })
//         .catch((error) => {
//           console.error("API Error:", error);
//         });
//     }, 600000);
//   };

//   useEffect(() => {
//     RefreshToken();
//   }, [refreshTokenNumber]);
  //--------------------------------------Authen Refresh Token----------------------------------------//

  const closeSidebar = () => {
    setIsSideBarShow(!isSideBarShow);
  };

  //-------------------- Next auth Refresh Token -------------------//
//   const [chainId, setChainId] = useState(process.env.NEXT_PUBLIC_CHAIN_NAME);
//   const message = process.env.NEXT_PUBLIC__SIGN_MESSAGE;
//   const [balance, setBalance] = useState(0);
//   const [token, setToken] = useState("usix");
//   const [rpcEndpoint, setRpcEndpoint] = useState<string>(
//     process.env.NEXT_PUBLIC__RPC1_ENDPOINT_SIX_FIVENET ||
//       "default-fallback-value"
//   );
//   const [exponent, setExponent] = useState(1e6);

  const loginApi = async () => {
    const offlineSigner = window.getOfflineSigner(chainId);
    const keplrAccounts = await offlineSigner.getAccounts();
    // console.log("gust");
    const signedMessage = await offlineSigner.keplr.signArbitrary(
      chainId,
      keplrAccounts[0].address,
      message
    );
    const client = await StargateClient.connect(rpcEndpoint);
    const balanceAsCoin = await client.getBalance(
      keplrAccounts[0].address,
      token
    );
    const balance = (parseFloat(balanceAsCoin.amount) * 1) / exponent;
    // DB request
    const apiUrl = `${process.env.NEXT_PUBLIC__API_ENDPOINT_SCHEMA_INFO}auth/login`; // Replace with your API endpoint
    const requestData = {
      channel: "Keply",
      ssoID: `${keplrAccounts[0].address}`,
      messagge: message,
      signature: `${signedMessage.signature}`,
    };
    await axios
      .post(apiUrl, requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(async (response) => {
        await signIn("credentials", {
          redirect: false, // Do not redirect, handle redirection manually after signing in
          accessToken: response.data.data.access_token,
          address: keplrAccounts[0].address,
          balance: balance,
        });
        // router.push('/home')
      })
      .catch((error: any) => {
        console.error("API Error:", error);
        // Handle errors here
      });
  };

  ///// check token /////
  const { data: session } = useSession();
  useEffect(() => {
    if (!session && pathname !== "/") {
      loginApi();
    }
  }, [session?.expires]);
  ///////////////////////
//  console.log("session",session)
  return (
    <>
      {pathname !== "/" ? (
        <div className=" flex flex-col justify-center items-center bg-bg overflow-x-hidden">
          <div className=" w-full h-[15vh]">
            <HomeNavBar />
          </div>
          <div className=" w-[95%] min-h-[75vh]   ">
            <Flex bgColor="" width={"100%"} height={"100%"} className="">
              <Box
                className=" duration-500   "
                bgColor=""
                width={isSideBarShow ? "78%" : "100%"}
                height={"80%"}
              >
                <main>{children}</main>
              </Box>
              <Flex
                className=" duration-500 mt-20  "
                width={isSideBarShow ? "22%" : "0%"}
                height={"20%"}
                position="relative"
              >
                <div
                  onClick={closeSidebar}
                  className={` absolute top-[-2%] left-0`}
                >
                  <CloseDetailButton
                    isSideBarShow={isSideBarShow}
                  ></CloseDetailButton>
                </div>
                {isSideBarShow && (
                  <Box width={"100%"}>
                    <div >
                      <HomeSidebar />
                    </div>
                  </Box>
                )}
              </Flex>
            </Flex>
          </div>
          <div className=" h-[10vh] w-full flex justify-end">
            <HomeFooter />
          </div>
        </div>
      ) : (
        <>
          <div>{children}</div>
        </>
      )}
    </>
  );
}