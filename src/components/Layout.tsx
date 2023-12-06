// import useSWR from "swr";
// import { useRouter } from "next/router";
// import Navbar from "@/components/NavBar";
// import Footer from "@/components/Footer";
"use client"
import { CircularProgress, Box, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState, useRef} from "react";
import { Divider, Center } from '@chakra-ui/react'

import HomeFooter from "@/components/HomeFooter";
import HomeNavBar from "@/components/HomeNavbar";
import HomeSidebar from "@/components/HomeSidebar";

export default function Layout({
    children,
    // modalstate,
}: {
    children: React.ReactNode;
    //   modalstate: { isOpen: boolean; onOpen: () => void; onClose: () => void };
}) {
    // const router = useRouter();

    //   const isHome = router.pathname === "/" || router.pathname === "/data" ? true : false;

    const boxRef = useRef<HTMLHRElement>(null);
    const [childrenHeight, setChildrenHeight] = useState(800)
    useEffect(() => {
        if (boxRef.current) {
          const { height } = boxRef.current.getBoundingClientRect();
          setChildrenHeight(height);
        }
      }, [children]);



    return (
        <>
            <HomeNavBar/>
            <Flex bgColor="#F5F6FA" height="650px" overflow="scroll">
                <Box  ref={boxRef} width={"70%"} height={"100%"}>
                    <main>{children}</main>
                </Box>
                <Flex width={"30%"} height={"100%"} >
                    <Center position="absolute" height={childrenHeight}>
                    <Divider orientation='vertical' borderColor={"brand"}/>
                    </Center>
                    <Box height={childrenHeight}>
                        <HomeSidebar />
                    </Box>
                </Flex>
            </Flex>
            <HomeFooter />
        </>
    );
}
