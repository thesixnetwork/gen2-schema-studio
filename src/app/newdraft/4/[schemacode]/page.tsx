// 'use client'

import TapState from "@/components/TapState";
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

// import { getDaft } from "./actions";
import { getSchemaInfo } from "@/service/getSchemaInfo";
import CradNewDaft from "@/components/CardNewDaft";
import { ISchemaInfo } from "@/type/Nftmngr";
import { useEffect, useState, useRef} from "react";
import { getAccessTokenFromLocalStorage } from "@/helpers/AuthService";


export default async function Page({
  params: { schemacode },
}: {
  params: { schemacode: string };
}) {
  const isDaft = await getSchemaInfo(schemacode,getAccessTokenFromLocalStorage());
  //   // console.log(JSON.stringify(isDaft, null, 2));
  return (
    <>
    <div>TEST</div>
      {/* {isDaft && (
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
          <Divider  borderColor={"brand"}/>
          <TapState isCurren={4} schemaCode={schemacode} />
          <Box p={6}>
            <CradNewDaft isDaft={isDaft} isState={4} />
          </Box>
        </Flex>
      )}

      {!isDaft && (
        <Flex p={4} flexWrap={"wrap"}>
          <Text>NOT FOUND SCHEMA CODE</Text>
        </Flex>
      )} */}
    </>
  );
}
