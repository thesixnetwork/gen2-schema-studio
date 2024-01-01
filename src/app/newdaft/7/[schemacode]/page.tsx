"use client";

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
import { getSchemaInfo } from "@/service/getSchemaInfo";
import { useEffect, useState, useRef } from "react";
import { ISchemaInfo } from "@/type/Nftmngr";
import CustomButton from "@/components/CustomButton";
import CustomCardDeploy from "@/components/CustomCardDeploy";


export default function Page({
    params: { schemacode },
  }: {
    params: { schemacode: string };
  }) {
    // console.log(session)
    //   // setIsClient(true);
    const [isDaft, setIsDaft] = useState<ISchemaInfo | null>(null);
  
    useEffect(() => {
      (async () => {
        try {
          const send = await getSchemaInfo(schemacode);
          setIsDaft(send);
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
          <Divider borderColor={"brand"} />
          <TapState isCurren={7} schemaCode={schemacode} />
            <Flex id="con-card-deploy" width="100%" justifyContent="space-evenly" marginTop="85px">
            <CustomCardDeploy text={"Testnet"}/>
            <CustomCardDeploy text={"Mainnet"}/>
            </Flex>
            <Flex width="100%" justifyContent="space-between" marginTop="96px">
                <CustomButton text={"Back"} />
            </Flex>
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