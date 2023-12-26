"use client";

import TapState from "@/components/TapState";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Divider,
  Text,
  Flex,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";

import { getSchemaInfo } from "@/service/getSchemaInfo";
import CradNewDaft from "@/components/CardNewDaft";
import { ISchemaInfo } from "@/type/Nftmngr";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import CustomButton from "@/components/CustomButton";

// import { testFunc  } from './action'
// import { cookies } from 'next/headers'
import { Suspense } from "react";
import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react'

export default function Page({
  params: { schemacode },
}: {
  params: { schemacode: string };
}) {
  const { data: session } = useSession();
  // console.log(session)
  //   // setIsClient(true);
  const [isDaft, setIsDaft] = useState<ISchemaInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const send = await getSchemaInfo(schemacode);
        setIsDaft(send);
        setLoading(false);
        // Process the response or update state as needed
      } catch (error) {
        // Handle errors
        console.error("Error fetching data:", error);
      }
    })();
  }, [schemacode]);
  // const isDaft = await getSchemaInfo(schemacode);
  // console.log(JSON.stringify(isDaft, null, 2));
  return (
    <>
      {isDaft && !loading && (
        <Flex p={10} flexWrap={"wrap"}>
          <Text
            color="#44498D"
            fontFamily="Montserrat"
            fontSize="32px"
            fontStyle="normal"
            fontWeight="400"
            lineHeight="normal"
          >
            {isDaft.schema_code}
          </Text>
          <Divider borderColor={"brand"} />
          <TapState isCurren={4} schemaCode={schemacode} />
          <Box p={6}>
            <CradNewDaft
              isDaft={isDaft}
              isState={4}
              setIsDaft={setIsDaft}
              schemacode={schemacode}
            />
          </Box>
          <Flex width="100%" justifyContent="space-between" marginTop="36px">
            <CustomButton text={"Back"} isCurren={4} schemaCode={schemacode} />
            <CustomButton text={"Next"} isCurren={4} schemaCode={schemacode} />
          </Flex>
        </Flex>
      )}

      {!isDaft && !loading && (
        <Flex p={4} flexWrap={"wrap"}>
          <Text>NOT FOUND SCHEMA CODE</Text>
        </Flex>
      )}
      
      {loading && !isDaft && (
        <Flex p={10} flexWrap={"wrap"}>
          <Text
            color="#44498D"
            fontFamily="Montserrat"
            fontSize="32px"
            fontStyle="normal"
            fontWeight="400"
            lineHeight="normal"
          >
            {schemacode}
          </Text>
          <Divider borderColor={"brand"} />
          <TapState isCurren={4} schemaCode={schemacode} />
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton
              key={index}
              margin="10px"
              maxW="200px"
              bgColor="#F5F6FA"
              width="200px"
              height="265px"
              borderRadius="8px"
            ></Skeleton>
          ))}
        </Flex>
      )}
    </>
  );
}
