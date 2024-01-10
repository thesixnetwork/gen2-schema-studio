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
import CradNewDaft from "@/components/CardNewDaft";
import { ISchemaInfo } from "@/type/Nftmngr";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import CustomButton from "@/components/CustomButton";
import { Skeleton } from "@chakra-ui/react";
import BackPageButton from "@/components/BackPageButton";
import NextPageButton from "@/components/NextPageButton";
import { useRouter } from "next/navigation";
import Stepmenu from "@/components/Stepmenu";
import Loading from "@/components/Loading";

// import { testFunc  } from './action'
// import { cookies } from 'next/headers'

export default function Page({
  params: { schemacode },
}: {
  params: { schemacode: string };
}) {
  // const { data: session } = useSession();
  //   // setIsClient(true);
  const [isDaft, setIsDaft] = useState<ISchemaInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [onEditOrCreate, setOnEditOrCreate] = useState(false);
  const router = useRouter();
  const [schemaCode, setSchemaCode] = useState("");
  const [stepDraft, setStepDraft] = useState(4);
  // console.log(schemacode)
  // console.log(isDaft)

  useEffect(() => {
    (async () => {
      try {
        const send = await getSchemaInfo(schemacode);
        setIsDaft(send);
        setSchemaCode(send.schema_info.code);
        setStepDraft(send.current_state);
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
        <Flex flexWrap={"wrap"}>
          {/* <Text
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
          <TapState isCurren={5} schemaCode={schemacode} /> */}
          <Stepmenu
            schemacode={schemaCode}
            currentStep={5}
            schemacodeNavigate={schemacode}
            stepDraft={stepDraft}
          ></Stepmenu>
          <Box marginTop="40px">
            <CradNewDaft
              isDaft={isDaft}
              isState={5}
              setIsDaft={setIsDaft}
              schemacode={schemacode}
              setOnEditOrCreate={setOnEditOrCreate}
            />
          </Box>
          {!onEditOrCreate && (
            <Flex width="100%" justifyContent="space-between" marginTop="36px">
              <div
                onClick={() => {
                  router.push(`/newdraft/4/${schemacode}`, { scroll: false });
                }}
              >
                <BackPageButton></BackPageButton>
              </div>
              <div
                onClick={() => {
                  router.push(`/newdraft/6/${schemacode}`, { scroll: false });
                }}
              >
                <NextPageButton loading={false}></NextPageButton>
              </div>
            </Flex>
          )}
        </Flex>
      )}

      {!isDaft && !loading && (
        <Flex p={4} flexWrap={"wrap"}>
          <Text>NOT FOUND SCHEMA CODE</Text>
        </Flex>
      )}

      {loading && !isDaft && <Loading></Loading>}
    </>
  );
}
