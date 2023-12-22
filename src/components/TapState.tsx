"use client"
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Text,
  Flex,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { useAccount, useConnect, useSuggestChainAndConnect } from "graz";
import { sixCustomChain } from "@/app/defineChain";
import type { FC } from "react";
import React from "react";
import { useRouter } from 'next/navigation'
 

const TapState: FC<{ isCurren: number, schemaCode: string }> = ({ isCurren, schemaCode }) => {
  const isState = [
    {
      state: 1,
      text: "basic data",
    },
    {
      state: 2,
      text: "Origin collection data",
    },
    {
      state: 3,
      text: "Origin token attributes",
    },
    {
      state: 4,
      text: "Onchain collection attributes",
    },
    {
      state: 5,
      text: "Onchain token attributes",
    },
    {
      state: 6,
      text: "Action",
    },
    {
      state: 7,
      text: "Deploy",
    },
  ];

//   const nextpage 
    const router = useRouter()
  const nextpage = async (page: number) => {
    const path = `/newdaft/${page}/${schemaCode}`
    router.push('sss')
    console.log(path)
  };

  return (
    <Flex p={2}>
      {isState &&
        isState.map((item, index) => (
          <Flex key={index} width="100%">
            <Flex width="100%">
              <Flex
                border="1px solid"
                borderColor="#79A0EF"
                bgColor={isCurren === index+1 ?"#3980F3" : ""}
                // width="40%"
                width= "40px"
                height= "56px"
                justifyContent="center"
                alignItems="center"
                _hover={{
                    cursor: "pointer",
                    bgColor: `${
                        isCurren === index+1 ? "#3980F3" : "#DADEF2"
                    }`,
                  }}
                onClick={() => router.push(`/newdaft/${isCurren}/${schemaCode}`)}
              >
                <Text 
                fontSize="32px" 
                fontStyle="normal"
                lineHeight="normal"
                fontFamily="Montserrat"
                fontWeight={isCurren === index+1 ? "1200": "400"} 
                color={isCurren === index+1 ? "#F5F6FA": "#79A0EF"}
                >
                    {item.state}
                </Text>
              </Flex>
              <Box width="60%" margin="10px">
                <Text
                  color="#79A0EF"
                  fontFamily="Montserrat"
                  fontSize="14px"
                  fontStyle="normal"
                  fontWeight="400"
                  lineHeight="normal"
                >
                  {item.text}
                </Text>
              </Box>
            </Flex>
          </Flex>
        ))}
    </Flex>
  );
};

export default TapState;
