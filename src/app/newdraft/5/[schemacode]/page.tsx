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
  // // console.log("session", session)
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
        <Flex className=" h-[75vh]  " flexWrap={"wrap"}>
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
            stepDraft={stepDraft} onEditing={false}          ></Stepmenu>
          <Box className=" w-full h-full p-10">
            <CradNewDaft
              isDaft={isDaft}
              isState={5}
              setIsDaft={setIsDaft}
              schemacode={schemacode}
              setOnEditOrCreate={setOnEditOrCreate}
            />
          </Box>
          {!onEditOrCreate && (
            <div className=" w-full flex justify-center items-center">
              <Flex className=" w-[90%] flex justify-between items-center" >
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
            </div>
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
