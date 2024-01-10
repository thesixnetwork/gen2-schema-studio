
"use client"
import { CircularProgress, Box, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { Divider, Center } from '@chakra-ui/react'
import { usePathname } from 'next/navigation'
import axios from 'axios'


import HomeFooter from "@/components/HomeFooter";
import HomeNavBar from "@/components/HomeNavbar";
import HomeSidebar from "@/components/HomeSidebar";
import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage, saveTokensToLocalStorage } from "@/helpers/AuthService";
import CloseDetailButton from "./CloseDetailButton";
import Loading from "./Loading";

export default function Layout({
    children,
    // modalstate,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname()
    const boxRef = useRef<HTMLHRElement>(null);
    const [childrenHeight, setChildrenHeight] = useState(800)

    //--------------------------------------Authen Refresh Token----------------------------------------//
    const [chainId, setChainId] = useState("fivenet");
    const [token, setToken] = useState("usix");
    const [cosmosAddress, setCosmosAddress] = useState("");
    const [rpcEndpoint, setRpcEndpoint] = useState<string>(
        process.env.NEXT_APP_RPC1_ENDPOINT_SIX_FIVENET || "default-fallback-value"
    );
    const message = process.env.NEXT_PUBLIC__SIGN_MESSAGE
    const [exponent, setExponent] = useState(1e6);
    //--------------------------------------Authen Refresh Token----------------------------------------//
    //--------------------------------------Frontend State----------------------------------------//
    const [isSideBarShow, setIsSideBarShow] = useState(true)
    const [checkIsThenOrWhen, setCheckIsThenOrWhen] = useState(false)
    //--------------------------------------Frontend State----------------------------------------//
    useEffect(() => {
        if (boxRef.current) {
            const { height } = boxRef.current.getBoundingClientRect();
            setChildrenHeight(height);
        }
    }, [children]);

    //--------------------------------------Authen Refresh Token----------------------------------------//
    const [refreshTokenNumber, setRefreshTokenNumber] = useState(0)
    const RefreshToken = () => {
        setTimeout(() => {
            const apiUrl = `${process.env.API_ENDPOINT_SCHEMA_INFO}auth/refreshToken`
            const requestData = {
                "refresh_token": `${getRefreshTokenFromLocalStorage()}`,
            };
            axios.post(apiUrl, requestData, {
                headers: {
                    'Authorization': `Bearer ${getAccessTokenFromLocalStorage()}`,
                },
            })
                .then(response => {
                    // console.log('API Response from refresh :', response.data);
                    saveTokensToLocalStorage(response.data.data.access_token, response.data.data.refresh_token)
                    const accessToken = getAccessTokenFromLocalStorage();
                    const refreshToken = getRefreshTokenFromLocalStorage();
                    // console.log("New Access: ", accessToken)
                    // console.log("New Refresh: ", refreshToken)
                    setRefreshTokenNumber(refreshTokenNumber + 1)
                })
                .catch(error => {
                    console.error('API Error:', error);
                });
        }, 600000);
    }

    useEffect(() => {
        RefreshToken()
    }, [refreshTokenNumber])

    useEffect(() => {
        pathname.includes("then") || pathname.includes("when") ? setCheckIsThenOrWhen(true) : setCheckIsThenOrWhen(false)
    },[pathname])
    //--------------------------------------Authen Refresh Token----------------------------------------//

    const closeSidebar = () => {
        setIsSideBarShow(!isSideBarShow)
    }

    useEffect(()=>{
        console.log("checker",checkIsThenOrWhen)
    },[checkIsThenOrWhen])

    return (
        <>
            {pathname !== "/" ?
                <div className=" flex flex-col justify-center items-center bg-bg overflow-x-hidden" >
                    <div className=" w-full h-[15vh]">
                        <HomeNavBar />
                    </div>
                    <div className=" w-[95%] min-h-[67vh] ">
                        <Flex bgColor="" width={"100%"} height={"100%"} className="" >
                            <Box className=" duration-500   " bgColor=""  width={isSideBarShow ? "78%" : "100%"} height={"80%"}>
                                <main>{children}</main>
                            </Box>
                            <Flex className=" duration-500  pt-[8vh] " width={isSideBarShow ? "22%" : "0%"} height={"20%"}  position="relative ">
                                <div onClick={closeSidebar} className={`pt-[8vh] absolute top-[-2%] left-0`} >
                                    <CloseDetailButton isSideBarShow={isSideBarShow}></CloseDetailButton>
                                </div>
                                {isSideBarShow &&
                                    <Box   width={"100%"}>
                                        <div >
                                            <HomeSidebar />
                                        </div>
                                    </Box>
                                }
                            </Flex>
                        </Flex>
                    </div>
                    <div className=" h-[10vh] w-full flex justify-end">
                        <HomeFooter />
                    </div>
                </div>
                :
                <>
                    <div>{children}</div>
                </>
            }
        </>
    );
}