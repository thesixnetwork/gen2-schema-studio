"use client";

// import TapState from "@/components/TapState";
import {
  Box,
  Text,
  Flex,
} from "@chakra-ui/react";

import { getSchemaInfo } from "@/service/getSchemaInfo";
import CradNewDaft from "@/components/CardNewDaft";
import { ISchemaInfo } from "@/type/Nftmngr";
import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";


import BackPageButton from "@/components/BackPageButton";
import NextPageButton from "@/components/NextPageButton";
import { useRouter } from "next/navigation";
import Stepmenu from "@/components/Stepmenu";
import Loading from "@/components/Loading";

export default function Page({
  params: { schemacode },
}: {
  params: { schemacode: string };
}) {
  // console.log(session)
  //   // setIsClient(true);
  const [isDaft, setIsDaft] = useState<ISchemaInfo | null>(null);
  const [initialDaft, setInitialDaft] = useState<ISchemaInfo | null>(null)
  const [loading, setLoading] = useState(true);
  const [onEditOrCreate, setOnEditOrCreate] = useState(false);
  const router = useRouter();
  const [schemaCode, setSchemaCode] = useState("");
  const [stepDraft, setStepDraft] = useState(3);

  useEffect(() => {
    (async () => {
      try {
        const schemaInfo = await getSchemaInfo(schemacode);
        if(schemaInfo){
          setIsDaft(schemaInfo);
          setInitialDaft(schemaInfo);
          setSchemaCode(schemaInfo.schema_info.code);
          setStepDraft(schemaInfo.current_state);
          setLoading(false);
        }
        // setIsDaft(schemaInfo);
        // setInitialDaft(schemaInfo);
        // setLoading(false);
        // Process the response or update state as needed
        // if (isDaft) {
        //   setSchemaCode(schemaInfo.schema_info.code);
        //   setStepDraft(schemaInfo.current_state);
        // }
        return;
      } catch (error) {
        // Handle errors
        console.error("Error fetching data:", error);
        return;
      }
    })();
  }, [schemacode]);

  // const getDraftInfo = () => {
  //   if (isDaft !== null) {
  //     setSchemaCode(isDaft.schema_info.code);
  //     setStepDraft(isDaft.current_state);
  //   }
  // };

  // useEffect(() => {
  //   getDraftInfo();
  // }, [isDaft]);
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
          <TapState isCurren={4} schemaCode={schemacode} /> */}
          <Stepmenu
            schemacode={schemaCode}
            currentStep={4}
            schemacodeNavigate={schemacode}
            stepDraft={stepDraft}
            onEditing={isDaft !== initialDaft}
          ></Stepmenu>
          <Box className=" w-full h-full px-10 my-10" >
            <CradNewDaft
              isDaft={isDaft}
              isState={4}
              setIsDaft={setIsDaft}
              schemacode={schemacode}
              setOnEditOrCreate={setOnEditOrCreate}
            />
          </Box>
          {!onEditOrCreate && (
            <div className=" w-full flex justify-center items-center">
              <Flex className=" w-[90%] flex justify-between items-center"  >
                <div
                  onClick={() => {
                    router.push(`/newdraft/3/${schemacode}`, { scroll: false });
                  }}
                >
                  <BackPageButton></BackPageButton>
                </div>
                <div
                  onClick={() => {
                    router.push(`/newdraft/5/${schemacode}`, { scroll: false });
                  }}
                >
                  <NextPageButton></NextPageButton>
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
