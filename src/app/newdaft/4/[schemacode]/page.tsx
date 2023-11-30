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
