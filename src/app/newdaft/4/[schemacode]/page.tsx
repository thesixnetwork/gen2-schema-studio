// 'use client'

import TapState from "@/components/TapState";
import {
  Box,
  Button,
  ButtonGroup,
  Text,
  Flex,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";

import { getDaft } from "./actions";
import CradNewDaft from "@/components/CardNewDaft";
// import { ISchemaInfo } from "@/type/Nftmngr";

export default async function Page({
  params: { schemacode },
}: {
  params: { schemacode: string };
}) {
  const isDaft = await getDaft(schemacode);
  //   console.log(JSON.stringify(isDaft, null, 2));

  return (
    <>
      {isDaft && (
        <Flex p={4} flexWrap={"wrap"}>
          <TapState isCurren={4} />
          <Box p={6}>
            <CradNewDaft isDaft={isDaft} />
          </Box>
        </Flex>
      )}

      {!isDaft && (
        <Flex p={4} flexWrap={"wrap"}>
          <Text>NOT FOUND SCHEMA CODE</Text>
        </Flex>
      )}
    </>
  );
}
